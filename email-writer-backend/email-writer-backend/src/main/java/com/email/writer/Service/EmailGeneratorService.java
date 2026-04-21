package com.email.writer.Service;

import com.email.writer.Dto.EmailRequestDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;
    private String apiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder
            ,@Value("${gemini.api.url}") String baseUrl
            ,@Value("${gemini.api.key}") String geminiApiKey) {

        this.apiKey = geminiApiKey;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public String generateEmailReply(EmailRequestDto emailRequestDto) {
        String prompt=buildPrompt(emailRequestDto);
        String requestBody=String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }
                """,prompt);

        String response=webClient.post().uri(uriBuilder
                -> uriBuilder.path("/v1beta/models/gemini-3-flash-preview:generateContent").build())
                .header("x-goog-api-key",apiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root=mapper.readTree(response);
            return root.path("candidates").get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }

    private String buildPrompt(EmailRequestDto emailRequestDto) {

        String tone = emailRequestDto.getTone();
        if (tone == null || tone.isBlank()) {
            tone = "professional";
        }

        tone = tone.trim().toLowerCase();

        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate ONLY ONE email reply.\n\n");

        prompt.append("Guidelines:\n");
        prompt.append("- The reply must sound natural and human-like\n");
        prompt.append("- Provide a detailed and well-structured response\n");
        prompt.append("- Expand slightly with context or explanation where appropriate\n");
        prompt.append("- Maintain clarity and readability (use short paragraphs)\n");
        prompt.append("- Do NOT generate multiple options\n");
        prompt.append("- Do NOT include explanations about the email itself\n");
        prompt.append("- Avoid placeholders like 'Dear Sender'\n\n");

        prompt.append("STRICT RULES:\n");
        prompt.append("- Do NOT assume facts not mentioned\n");
        prompt.append("- Do NOT invent actions (like 'attached', 'completed')\n");
        prompt.append("- Maintain correct role and perspective\n");
        prompt.append("- You may include safe and realistic details (like timelines or next steps)\n\n");

        prompt.append("Tone:\n");
        prompt.append("Use a ").append(tone).append(" tone.\n\n");

        prompt.append("Structure:\n");
        prompt.append("- Start with a natural greeting\n");
        prompt.append("- Add a clear main response\n");
        prompt.append("- Provide additional helpful context if needed\n");
        prompt.append("- End with a polite closing line\n\n");

        prompt.append("Original email:\n");
        prompt.append(emailRequestDto.getEmailContent());

        return prompt.toString();
    }
}
