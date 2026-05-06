package com.example.demo.dto;

import com.example.demo.entity.StatusTriagem;

import jakarta.validation.constraints.NotNull;

public record AtualizarStatusTriagemRequest(
        @NotNull(message = "O status e obrigatorio")
        StatusTriagem status
) {
}
