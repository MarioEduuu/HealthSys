package com.example.demo.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.AtualizarProntuarioRequest;
import com.example.demo.dto.ConsultaRequest;
import com.example.demo.dto.ConsultaResponse;
import com.example.demo.dto.ExameRequest;
import com.example.demo.dto.ExameResponse;
import com.example.demo.dto.MedicamentoRequest;
import com.example.demo.dto.MedicamentoResponse;
import com.example.demo.dto.ProntuarioRequest;
import com.example.demo.dto.ProntuarioResponse;
import com.example.demo.dto.VacinaRequest;
import com.example.demo.dto.VacinaResponse;
import com.example.demo.entity.Consulta;
import com.example.demo.entity.Exame;
import com.example.demo.entity.Medicamento;
import com.example.demo.entity.Paciente;
import com.example.demo.entity.Prontuario;
import com.example.demo.entity.Vacina;
import com.example.demo.repository.ConsultaRepository;
import com.example.demo.repository.ExameRepository;
import com.example.demo.repository.MedicamentoRepository;
import com.example.demo.repository.PacienteRepository;
import com.example.demo.repository.ProntuarioRepository;
import com.example.demo.repository.VacinaRepository;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;
    private final ExameRepository exameRepository;
    private final MedicamentoRepository medicamentoRepository;
    private final VacinaRepository vacinaRepository;

    public ProntuarioService(ProntuarioRepository prontuarioRepository, PacienteRepository pacienteRepository,
            ConsultaRepository consultaRepository, ExameRepository exameRepository,
            MedicamentoRepository medicamentoRepository, VacinaRepository vacinaRepository) {
        this.prontuarioRepository = prontuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.consultaRepository = consultaRepository;
        this.exameRepository = exameRepository;
        this.medicamentoRepository = medicamentoRepository;
        this.vacinaRepository = vacinaRepository;
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public ProntuarioResponse criar(ProntuarioRequest request) {
        if (prontuarioRepository.findByPacienteId(request.pacienteId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Paciente ja possui prontuario");
        }

        Paciente paciente = buscarPaciente(request.pacienteId());

        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(paciente);
        prontuario.setHistoricoClinico(request.historicoClinico());
        prontuario.setObservacoesGerais(request.observacoesGerais());

        return toResponse(prontuarioRepository.save(prontuario));
    }

    public ProntuarioResponse buscarPorPaciente(Long patientId) {
        return toResponse(prontuarioRepository.findByPacienteId(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prontuario nao encontrado")));
    }

    @Transactional
    public ProntuarioResponse atualizar(Long id, AtualizarProntuarioRequest request) {
        Prontuario prontuario = buscarProntuario(id);
        prontuario.setHistoricoClinico(request.historicoClinico());
        prontuario.setObservacoesGerais(request.observacoesGerais());
        return toResponse(prontuarioRepository.save(prontuario));
    }

    @Transactional
    public ProntuarioResponse adicionarConsulta(Long prontuarioId, ConsultaRequest request) {
        Prontuario prontuario = buscarProntuario(prontuarioId);

        Consulta consulta = new Consulta();
        consulta.setProntuario(prontuario);
        consulta.setDataConsulta(request.dataConsulta());
        consulta.setDescricao(request.descricao());
        consulta.setConduta(request.conduta());
        consultaRepository.save(consulta);

        return toResponse(prontuario);
    }

    @Transactional
    public ProntuarioResponse adicionarExame(Long prontuarioId, ExameRequest request) {
        Prontuario prontuario = buscarProntuario(prontuarioId);

        Exame exame = new Exame();
        exame.setProntuario(prontuario);
        exame.setTipoExame(request.tipoExame());
        exame.setDataExame(request.dataExame());
        exame.setResultado(request.resultado());
        exameRepository.save(exame);

        return toResponse(prontuario);
    }

    @Transactional
    public ProntuarioResponse adicionarMedicamento(Long prontuarioId, MedicamentoRequest request) {
        Prontuario prontuario = buscarProntuario(prontuarioId);

        Medicamento medicamento = new Medicamento();
        medicamento.setProntuario(prontuario);
        medicamento.setNome(request.nome());
        medicamento.setDosagem(request.dosagem());
        medicamento.setFrequencia(request.frequencia());
        medicamento.setDuracao(request.duracao());
        medicamentoRepository.save(medicamento);

        return toResponse(prontuario);
    }

    @Transactional
    public VacinaResponse adicionarVacina(Long pacienteId, VacinaRequest request) {
        Paciente paciente = buscarPaciente(pacienteId);

        Vacina vacina = new Vacina();
        vacina.setPaciente(paciente);
        vacina.setNomeVacina(request.nomeVacina());
        vacina.setDataAplicacao(request.dataAplicacao());

        return toVacinaResponse(vacinaRepository.save(vacina));
    }

    public List<VacinaResponse> listarVacinas(Long pacienteId) {
        buscarPaciente(pacienteId);
        return vacinaRepository.findByPacienteIdOrderByDataAplicacaoDesc(pacienteId)
                .stream()
                .map(this::toVacinaResponse)
                .toList();
    }

    public long countProntuarios() {
        return prontuarioRepository.count();
    }

    private Paciente buscarPaciente(Long pacienteId) {
        return pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente nao encontrado"));
    }

    private Prontuario buscarProntuario(Long id) {
        return prontuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prontuario nao encontrado"));
    }

    private ProntuarioResponse toResponse(Prontuario prontuario) {
        List<ConsultaResponse> consultas = consultaRepository.findByProntuarioIdOrderByDataConsultaDesc(prontuario.getId())
                .stream()
                .map(consulta -> new ConsultaResponse(
                        consulta.getId(),
                        consulta.getDataConsulta(),
                        consulta.getDescricao(),
                        consulta.getConduta()))
                .toList();

        List<ExameResponse> exames = exameRepository.findByProntuarioIdOrderByDataExameDesc(prontuario.getId())
                .stream()
                .map(exame -> new ExameResponse(
                        exame.getId(),
                        exame.getTipoExame(),
                        exame.getDataExame(),
                        exame.getResultado()))
                .toList();

        List<MedicamentoResponse> medicamentos = medicamentoRepository.findByProntuarioIdOrderByIdDesc(prontuario.getId())
                .stream()
                .map(medicamento -> new MedicamentoResponse(
                        medicamento.getId(),
                        medicamento.getNome(),
                        medicamento.getDosagem(),
                        medicamento.getFrequencia(),
                        medicamento.getDuracao()))
                .toList();

        List<VacinaResponse> vacinas = vacinaRepository.findByPacienteIdOrderByDataAplicacaoDesc(prontuario.getPaciente().getId())
                .stream()
                .map(this::toVacinaResponse)
                .toList();

        return new ProntuarioResponse(
                prontuario.getId(),
                prontuario.getPaciente().getId(),
                prontuario.getPaciente().getNome(),
                prontuario.getHistoricoClinico(),
                prontuario.getObservacoesGerais(),
                prontuario.getCreatedAt(),
                prontuario.getUpdatedAt(),
                consultas,
                exames,
                medicamentos,
                vacinas);
    }

    private VacinaResponse toVacinaResponse(Vacina vacina) {
        return new VacinaResponse(vacina.getId(), vacina.getNomeVacina(), vacina.getDataAplicacao());
    }
}
