package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.AtualizarStatusTriagemRequest;
import com.example.demo.dto.TriagemRequest;
import com.example.demo.dto.TriagemResponse;
import com.example.demo.entity.Paciente;
import com.example.demo.entity.StatusTriagem;
import com.example.demo.entity.Triagem;
import com.example.demo.event.TriageCreatedEvent;
import com.example.demo.event.TriageEventPublisher;
import com.example.demo.repository.PacienteRepository;
import com.example.demo.repository.TriagemRepository;

@Service
public class TriageService {

    private final TriagemRepository triagemRepository;
    private final PacienteRepository pacienteRepository;
    private final TriageEventPublisher triageEventPublisher;

    public TriageService(TriagemRepository triagemRepository, PacienteRepository pacienteRepository,
            TriageEventPublisher triageEventPublisher) {
        this.triagemRepository = triagemRepository;
        this.pacienteRepository = pacienteRepository;
        this.triageEventPublisher = triageEventPublisher;
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public TriagemResponse criar(TriagemRequest request) {
        Paciente paciente = buscarPaciente(request.pacienteId());

        Triagem triagem = new Triagem();
        triagem.setPaciente(paciente);
        triagem.setSintomas(request.sintomas());
        triagem.setNivelRisco(request.nivelRisco());
        triagem.setStatus(request.status());
        triagem.setDataTriagem(LocalDateTime.now());

        Triagem triagemSalva = triagemRepository.save(triagem);

        triageEventPublisher.publish(new TriageCreatedEvent(
                "TRIAGE_CREATED",
                triagemSalva.getId(),
                paciente.getId(),
                paciente.getNome(),
                triagemSalva.getNivelRisco().name(),
                triagemSalva.getStatus().name(),
                triagemSalva.getDataTriagem()));

        return toResponse(triagemSalva);
    }

    public List<TriagemResponse> listarTodas() {
        return triagemRepository.findAllByOrderByDataTriagemDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TriagemResponse buscarPorId(Long id) {
        return toResponse(buscarTriagem(id));
    }

    public List<TriagemResponse> listarPorPaciente(Long patientId) {
        buscarPaciente(patientId);
        return triagemRepository.findByPacienteIdOrderByDataTriagemDesc(patientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public TriagemResponse atualizarStatus(Long id, AtualizarStatusTriagemRequest request) {
        Triagem triagem = buscarTriagem(id);
        triagem.setStatus(request.status());
        return toResponse(triagemRepository.save(triagem));
    }

    public long countAbertas() {
        return triagemRepository.countByStatus(StatusTriagem.ABERTA);
    }

    private Paciente buscarPaciente(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente nao encontrado"));
    }

    private Triagem buscarTriagem(Long id) {
        return triagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Triagem nao encontrada"));
    }

    private TriagemResponse toResponse(Triagem triagem) {
        return new TriagemResponse(
                triagem.getId(),
                triagem.getPaciente().getId(),
                triagem.getPaciente().getNome(),
                triagem.getSintomas(),
                triagem.getNivelRisco(),
                triagem.getStatus(),
                triagem.getDataTriagem());
    }
}
