package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProntuarioRequest(
        @NotNull(message = "O pacienteId e obrigatorio")
        Long pacienteId,
        @NotBlank(message = "O historico clinico e obrigatorio")
        String historicoClinico,
        String observacoesGerais
) {
}
