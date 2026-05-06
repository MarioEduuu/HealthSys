package com.example.demo.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardSummaryResponse;
import com.example.demo.repository.PacienteRepository;
import com.example.demo.repository.UsuarioRepository;

@Service
public class DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final TriageService triageService;
    private final NotificationService notificationService;
    private final ProntuarioService prontuarioService;

    public DashboardService(UsuarioRepository usuarioRepository, PacienteRepository pacienteRepository,
            TriageService triageService, NotificationService notificationService, ProntuarioService prontuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.triageService = triageService;
        this.notificationService = notificationService;
        this.prontuarioService = prontuarioService;
    }

    @Cacheable("dashboard")
    public DashboardSummaryResponse getSummary() {
        return new DashboardSummaryResponse(
                usuarioRepository.countByAtivoTrue(),
                pacienteRepository.count(),
                triageService.countAbertas(),
                notificationService.countNaoLidas(),
                prontuarioService.countProntuarios());
    }
}
