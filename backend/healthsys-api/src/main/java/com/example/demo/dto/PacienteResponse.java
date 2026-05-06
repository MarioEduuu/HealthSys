package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.entity.Sexo;

public record PacienteResponse(
        Long id,
        String nome,
        LocalDate dataNascimento,
        Sexo sexo,
        String telefone,
        String email,
        String endereco,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
