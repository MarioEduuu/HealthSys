package com.example.demo.dto;

import com.example.demo.entity.Perfil;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        Perfil perfil,
        boolean ativo
) {
}
