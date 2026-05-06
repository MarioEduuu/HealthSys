package com.example.demo.dto;

import java.time.LocalDateTime;

import com.example.demo.entity.StatusNotificacao;

public record NotificacaoResponse(
        Long id,
        String titulo,
        String mensagem,
        StatusNotificacao status,
        LocalDateTime dataEnvio,
        Long usuarioDestinoId,
        Long pacienteId
) {
}
