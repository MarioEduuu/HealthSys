package com.example.demo.dto;

public record DashboardSummaryResponse(
        long totalUsuariosAtivos,
        long totalPacientes,
        long totalTriagensAbertas,
        long totalNotificacoesNaoLidas,
        long totalProntuarios
) {
}
