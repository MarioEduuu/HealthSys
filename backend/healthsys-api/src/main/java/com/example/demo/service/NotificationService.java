package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.NotificacaoResponse;
import com.example.demo.entity.Notificacao;
import com.example.demo.entity.StatusNotificacao;
import com.example.demo.event.TriageCreatedEvent;
import com.example.demo.repository.NotificacaoRepository;

@Service
public class NotificationService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificationService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    public List<NotificacaoResponse> listarTodas() {
        return notificacaoRepository.findAllByOrderByDataEnvioDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NotificacaoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public NotificacaoResponse marcarComoLida(Long id) {
        Notificacao notificacao = buscarEntidade(id);
        notificacao.setStatus(StatusNotificacao.LIDA);
        return toResponse(notificacaoRepository.save(notificacao));
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public void createFromTriageEvent(TriageCreatedEvent event) {
        Notificacao notificacao = new Notificacao();
        notificacao.setTitulo("Nova triagem registrada");
        notificacao.setMensagem("Paciente " + event.patientName() + " possui triagem com risco "
                + event.riskLevel() + ".");
        notificacao.setStatus(StatusNotificacao.NAO_LIDA);
        notificacao.setDataEnvio(LocalDateTime.now());
        notificacao.setPacienteId(event.patientId());
        notificacaoRepository.save(notificacao);
    }

    public long countNaoLidas() {
        return notificacaoRepository.countByStatus(StatusNotificacao.NAO_LIDA);
    }

    private Notificacao buscarEntidade(Long id) {
        return notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificacao nao encontrada"));
    }

    private NotificacaoResponse toResponse(Notificacao notificacao) {
        return new NotificacaoResponse(
                notificacao.getId(),
                notificacao.getTitulo(),
                notificacao.getMensagem(),
                notificacao.getStatus(),
                notificacao.getDataEnvio(),
                notificacao.getUsuarioDestinoId(),
                notificacao.getPacienteId());
    }
}
