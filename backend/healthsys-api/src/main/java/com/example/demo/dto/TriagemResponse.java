package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.NivelRisco;
import com.example.demo.entity.StatusTriagem;

public record TriagemResponse(
        Long id,
        Long pacienteId,
        String pacienteNome,
        String sintomas,
        NivelRisco nivelRisco,
        StatusTriagem status,
        LocalDateTime dataTriagem
) {
}
