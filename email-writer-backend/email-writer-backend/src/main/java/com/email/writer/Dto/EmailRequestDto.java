package com.email.writer.Dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EmailRequestDto {
    private String emailContent;
    private String tone;
}
