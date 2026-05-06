package com.example.demo.dto;

import com.example.demo.entity.Perfil;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CadastroUsuarioRequest(
        @NotBlank(message = "O nome e obrigatorio")
        String nome,
        @Email(message = "O email deve ser valido")
        @NotBlank(message = "O email e obrigatorio")
        String email,
        @NotBlank(message = "A senha e obrigatoria")
        String senha,
        @NotNull(message = "O perfil e obrigatorio")
        Perfil perfil
) {
}
