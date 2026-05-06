package com.example.demo.dto;

import java.time.LocalDate;

public record VacinaResponse(
        Long id,
        String nomeVacina,
        LocalDate dataAplicacao
) {
}
