package com.example.demo.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VacinaRequest(
        @NotBlank(message = "O nome da vacina e obrigatorio")
        String nomeVacina,
        @NotNull(message = "A data de aplicacao e obrigatoria")
        LocalDate dataAplicacao
) {
}
