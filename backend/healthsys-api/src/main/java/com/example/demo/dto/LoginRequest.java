package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "O email deve ser valido")
        @NotBlank(message = "O email e obrigatorio")
        String email,
        @NotBlank(message = "A senha e obrigatoria")
        String senha
) {
}
