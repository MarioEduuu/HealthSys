package com.example.demo.service;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;

@Service
public class CurrentUserService {

    private final UsuarioRepository usuarioRepository;

    public CurrentUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())) {
            return Optional.empty();
        }

        return usuarioRepository.findByEmail(authentication.getName());
    }

    public Optional<Long> getCurrentUserId() {
        return getCurrentUser().map(Usuario::getId);
    }
}
