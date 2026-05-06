package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.AtualizarPacienteRequest;
import com.example.demo.dto.CadastroPacienteRequest;
import com.example.demo.dto.PacienteResponse;
import com.example.demo.entity.Paciente;
import com.example.demo.entity.PatientAuditLog;
import com.example.demo.repository.PacienteRepository;
import com.example.demo.repository.PatientAuditLogRepository;
import com.example.demo.repository.ProntuarioRepository;
import com.example.demo.repository.TriagemRepository;
import com.example.demo.repository.VacinaRepository;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final PatientAuditLogRepository patientAuditLogRepository;
    private final CurrentUserService currentUserService;
    private final TriagemRepository triagemRepository;
    private final ProntuarioRepository prontuarioRepository;
    private final VacinaRepository vacinaRepository;

    public PacienteService(PacienteRepository pacienteRepository, PatientAuditLogRepository patientAuditLogRepository,
            CurrentUserService currentUserService, TriagemRepository triagemRepository,
            ProntuarioRepository prontuarioRepository, VacinaRepository vacinaRepository) {
        this.pacienteRepository = pacienteRepository;
        this.patientAuditLogRepository = patientAuditLogRepository;
        this.currentUserService = currentUserService;
        this.triagemRepository = triagemRepository;
        this.prontuarioRepository = prontuarioRepository;
        this.vacinaRepository = vacinaRepository;
    }

    @Cacheable("patients")
    public List<PacienteResponse> listarTodos() {
        return pacienteRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Cacheable(value = "patient-search", key = "#nome")
    public List<PacienteResponse> buscarPorNome(String nome) {
        return pacienteRepository.findByNomeContainingIgnoreCaseOrderByNomeAsc(nome)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PacienteResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = {"patients", "patient-search", "dashboard"}, allEntries = true)
    public PacienteResponse cadastrar(CadastroPacienteRequest request) {
        Paciente paciente = new Paciente();
        paciente.setNome(request.nome());
        paciente.setDataNascimento(request.dataNascimento());
        paciente.setSexo(request.sexo());
        paciente.setTelefone(request.telefone());
        paciente.setEmail(request.email());
        paciente.setEndereco(request.endereco());

        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    @CacheEvict(value = {"patients", "patient-search", "dashboard"}, allEntries = true)
    public PacienteResponse atualizar(Long id, AtualizarPacienteRequest request) {
        Paciente paciente = buscarEntidade(id);

        registrarAlteracao(paciente, "nome", paciente.getNome(), request.nome());
        registrarAlteracao(paciente, "dataNascimento", paciente.getDataNascimento(), request.dataNascimento());
        registrarAlteracao(paciente, "sexo", paciente.getSexo(), request.sexo());
        registrarAlteracao(paciente, "telefone", paciente.getTelefone(), request.telefone());
        registrarAlteracao(paciente, "email", paciente.getEmail(), request.email());
        registrarAlteracao(paciente, "endereco", paciente.getEndereco(), request.endereco());

        paciente.setNome(request.nome());
        paciente.setDataNascimento(request.dataNascimento());
        paciente.setSexo(request.sexo());
        paciente.setTelefone(request.telefone());
        paciente.setEmail(request.email());
        paciente.setEndereco(request.endereco());

        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    @CacheEvict(value = {"patients", "patient-search", "dashboard"}, allEntries = true)
    public void excluir(Long id) {
        Paciente paciente = buscarEntidade(id);
        validarExclusaoPermitida(id);
        pacienteRepository.delete(paciente);
    }

    private void validarExclusaoPermitida(Long pacienteId) {
        long totalTriagens = triagemRepository.countByPacienteId(pacienteId);
        long totalVacinas = vacinaRepository.countByPacienteId(pacienteId);
        boolean possuiProntuario = prontuarioRepository.existsByPacienteId(pacienteId);

        if (totalTriagens == 0 && totalVacinas == 0 && !possuiProntuario) {
            return;
        }

        throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Nao e possivel excluir este paciente porque ele possui registros vinculados. "
                        + "Remova ou mantenha o historico clinico, triagens e vacinas antes de excluir.");
    }

    private void registrarAlteracao(Paciente paciente, String campo, Object valorAnterior, Object valorNovo) {
        if (Objects.equals(valorAnterior, valorNovo)) {
            return;
        }

        PatientAuditLog log = new PatientAuditLog();
        log.setPatientId(paciente.getId());
        log.setCampoAlterado(campo);
        log.setValorAnterior(valorAnterior != null ? valorAnterior.toString() : null);
        log.setValorNovo(valorNovo != null ? valorNovo.toString() : null);
        log.setUsuarioId(currentUserService.getCurrentUserId().orElse(null));
        log.setDataAlteracao(LocalDateTime.now());
        patientAuditLogRepository.save(log);
    }

    private Paciente buscarEntidade(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente nao encontrado"));
    }

    private PacienteResponse toResponse(Paciente paciente) {
        return new PacienteResponse(
                paciente.getId(),
                paciente.getNome(),
                paciente.getDataNascimento(),
                paciente.getSexo(),
                paciente.getTelefone(),
                paciente.getEmail(),
                paciente.getEndereco(),
                paciente.getCreatedAt(),
                paciente.getUpdatedAt());
    }
}
