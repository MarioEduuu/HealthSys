package com.example.demo.dto;

import java.time.LocalDateTime;

public record ConsultaResponse(
        Long id,
        LocalDateTime dataConsulta,
        String descricao,
        String conduta
) {
}
