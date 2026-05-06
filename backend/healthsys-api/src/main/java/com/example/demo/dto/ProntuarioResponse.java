package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProntuarioResponse(
        Long id,
        Long pacienteId,
        String pacienteNome,
        String historicoClinico,
        String observacoesGerais,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ConsultaResponse> consultas,
        List<ExameResponse> exames,
        List<MedicamentoResponse> medicamentos,
        List<VacinaResponse> vacinas
) {
}
