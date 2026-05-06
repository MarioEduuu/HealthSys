package com.example.demo.dto;

import java.time.LocalDateTime;

public record ExameResponse(
        Long id,
        String tipoExame,
        LocalDateTime dataExame,
        String resultado
) {
}
