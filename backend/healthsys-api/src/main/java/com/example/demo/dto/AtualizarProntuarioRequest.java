package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record AtualizarProntuarioRequest(
        @NotBlank(message = "O historico clinico e obrigatorio")
        String historicoClinico,
        String observacoesGerais
) {
}
