package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record MedicamentoRequest(
        @NotBlank(message = "O nome do medicamento e obrigatorio")
        String nome,
        @NotBlank(message = "A dosagem e obrigatoria")
        String dosagem,
        @NotBlank(message = "A frequencia e obrigatoria")
        String frequencia,
        @NotBlank(message = "A duracao e obrigatoria")
        String duracao
) {
}
