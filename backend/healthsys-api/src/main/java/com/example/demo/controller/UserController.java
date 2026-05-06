package com.example.demo.controller;

import java.util.List;


import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AtualizarStatusUsuarioRequest;
import com.example.demo.dto.AtualizarUsuarioRequest;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.service.UsuarioService;

import jakarta.validation.Valid;

@Validated
@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UserController {

    private final UsuarioService usuarioService;

    public UserController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarUsuarioRequest request) {
        return usuarioService.atualizar(id, request);
    }

    @PatchMapping("/{id}/status")
    public UsuarioResponse atualizarStatus(@PathVariable Long id,
            @Valid @RequestBody AtualizarStatusUsuarioRequest request) {
        return usuarioService.atualizarStatus(id, request);
    }
}
