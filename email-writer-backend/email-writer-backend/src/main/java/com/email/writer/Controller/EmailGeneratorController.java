package com.email.writer.Controller;

import com.email.writer.Dto.EmailRequestDto;
import com.email.writer.Service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins="*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequestDto emailRequestDto) {
        String response=emailGeneratorService.generateEmailReply(emailRequestDto);
        return ResponseEntity.ok(response);
    }

}
