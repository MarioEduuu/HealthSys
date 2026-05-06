package com.example.demo.controller;

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AtualizarStatusTriagemRequest;
import com.example.demo.dto.TriagemRequest;
import com.example.demo.dto.TriagemResponse;
import com.example.demo.service.TriageService;

import jakarta.validation.Valid;

@Validated
@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/api/triages")
public class TriageController {

    private final TriageService triageService;

    public TriageController(TriageService triageService) {
        this.triageService = triageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TriagemResponse criar(@Valid @RequestBody TriagemRequest request) {
        return triageService.criar(request);
    }

    @GetMapping
    public List<TriagemResponse> listarTodas() {
        return triageService.listarTodas();
    }

    @GetMapping("/{id}")
    public TriagemResponse buscarPorId(@PathVariable Long id) {
        return triageService.buscarPorId(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<TriagemResponse> listarPorPaciente(@PathVariable Long patientId) {
        return triageService.listarPorPaciente(patientId);
    }

    @PatchMapping("/{id}/status")
    public TriagemResponse atualizarStatus(@PathVariable Long id,
            @Valid @RequestBody AtualizarStatusTriagemRequest request) {
        return triageService.atualizarStatus(id, request);
    }
}
