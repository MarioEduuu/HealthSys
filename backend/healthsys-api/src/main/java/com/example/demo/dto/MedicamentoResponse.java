package com.example.demo.dto;

public record MedicamentoResponse(
        Long id,
        String nome,
        String dosagem,
        String frequencia,
        String duracao
) {
}
