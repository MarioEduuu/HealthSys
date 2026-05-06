package com.example.demo.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ExameRequest(
        @NotBlank(message = "O tipo de exame e obrigatorio")
        String tipoExame,
        @NotNull(message = "A data do exame e obrigatoria")
        LocalDateTime dataExame,
        String resultado
) {
}
