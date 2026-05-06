package com.example.demo.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.AtualizarStatusUsuarioRequest;
import com.example.demo.dto.AtualizarUsuarioRequest;
import com.example.demo.dto.UsuarioResponse;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public UsuarioResponse atualizar(Long id, AtualizarUsuarioRequest request) {
        Usuario usuario = buscarEntidade(id);

        usuarioRepository.findByEmail(request.email())
                .filter(outroUsuario -> !outroUsuario.getId().equals(id))
                .ifPresent(outroUsuario -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Ja existe um usuario com esse email");
                });

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setPerfil(request.perfil());

        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    @CacheEvict(value = "dashboard", allEntries = true)
    public UsuarioResponse atualizarStatus(Long id, AtualizarStatusUsuarioRequest request) {
        Usuario usuario = buscarEntidade(id);
        usuario.setAtivo(request.ativo());
        return toResponse(usuarioRepository.save(usuario));
    }

    private Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado"));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil(),
                usuario.isAtivo());
    }
}
