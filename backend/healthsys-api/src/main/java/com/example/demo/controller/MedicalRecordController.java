package com.example.demo.controller;

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AtualizarProntuarioRequest;
import com.example.demo.dto.ConsultaRequest;
import com.example.demo.dto.ExameRequest;
import com.example.demo.dto.MedicamentoRequest;
import com.example.demo.dto.ProntuarioRequest;
import com.example.demo.dto.ProntuarioResponse;
import com.example.demo.dto.VacinaRequest;
import com.example.demo.dto.VacinaResponse;
import com.example.demo.service.ProntuarioService;

import jakarta.validation.Valid;

@Validated
@RestController

@CrossOrigin(origins = "*")
public class MedicalRecordController {

    private final ProntuarioService prontuarioService;

    public MedicalRecordController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @PostMapping("/api/medical-records")
    @ResponseStatus(HttpStatus.CREATED)
    public ProntuarioResponse criar(@Valid @RequestBody ProntuarioRequest request) {
        return prontuarioService.criar(request);
    }

    @GetMapping("/api/medical-records/patient/{patientId}")
    public ProntuarioResponse buscarPorPaciente(@PathVariable Long patientId) {
        return prontuarioService.buscarPorPaciente(patientId);
    }

    @PutMapping("/api/medical-records/{id}")
    public ProntuarioResponse atualizar(@PathVariable Long id,
            @Valid @RequestBody AtualizarProntuarioRequest request) {
        return prontuarioService.atualizar(id, request);
    }

    @PostMapping("/api/medical-records/{id}/consultas")
    public ProntuarioResponse adicionarConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequest request) {
        return prontuarioService.adicionarConsulta(id, request);
    }

    @PostMapping("/api/medical-records/{id}/exames")
    public ProntuarioResponse adicionarExame(@PathVariable Long id, @Valid @RequestBody ExameRequest request) {
        return prontuarioService.adicionarExame(id, request);
    }

    @PostMapping("/api/medical-records/{id}/medicamentos")
    public ProntuarioResponse adicionarMedicamento(@PathVariable Long id,
            @Valid @RequestBody MedicamentoRequest request) {
        return prontuarioService.adicionarMedicamento(id, request);
    }

    @PostMapping("/api/patients/{patientId}/vacinas")
    @ResponseStatus(HttpStatus.CREATED)
    public VacinaResponse adicionarVacina(@PathVariable Long patientId, @Valid @RequestBody VacinaRequest request) {
        return prontuarioService.adicionarVacina(patientId, request);
    }

    @GetMapping("/api/patients/{patientId}/vacinas")
    public List<VacinaResponse> listarVacinas(@PathVariable Long patientId) {
        return prontuarioService.listarVacinas(patientId);
    }
}
