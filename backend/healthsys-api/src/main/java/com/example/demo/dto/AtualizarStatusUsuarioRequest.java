package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record AtualizarStatusUsuarioRequest(
        @NotNull(message = "O status e obrigatorio")
        Boolean ativo
) {
}
