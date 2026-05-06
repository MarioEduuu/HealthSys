package com.example.demo.dto;

import com.example.demo.entity.NivelRisco;
import com.example.demo.entity.StatusTriagem;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TriagemRequest(
        @NotNull(message = "O pacienteId e obrigatorio")
        Long pacienteId,
        @NotBlank(message = "Os sintomas sao obrigatorios")
        String sintomas,
        @NotNull(message = "O nivel de risco e obrigatorio")
        NivelRisco nivelRisco,
        @NotNull(message = "O status e obrigatorio")
        StatusTriagem status
) {
}
