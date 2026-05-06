package com.example.demo.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConsultaRequest(
        @NotNull(message = "A data da consulta e obrigatoria")
        LocalDateTime dataConsulta,
        @NotBlank(message = "A descricao e obrigatoria")
        String descricao,
        String conduta
) {
}
