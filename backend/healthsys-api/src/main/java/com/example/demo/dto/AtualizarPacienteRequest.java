package com.example.demo.dto;

import java.time.LocalDate;

import com.example.demo.entity.Sexo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AtualizarPacienteRequest(
        @NotBlank(message = "O nome e obrigatorio")
        String nome,
        @NotNull(message = "A data de nascimento e obrigatoria")
        @Past(message = "A data de nascimento deve estar no passado")
        LocalDate dataNascimento,
        @NotNull(message = "O sexo e obrigatorio")
        Sexo sexo,
        @NotBlank(message = "O telefone e obrigatorio")
        @Pattern(
                regexp = "^(\\d{11}|\\(\\d{2}\\) \\d \\d{4}-\\d{4})$",
                message = "O telefone deve ter 11 digitos ou estar no formato (85) 9 9999-9999")
        String telefone,
        @Email(message = "O email deve ser valido")
        String email,
        @Size(max = 200, message = "O endereco deve ter no maximo 200 caracteres")
        String endereco
) {
}
