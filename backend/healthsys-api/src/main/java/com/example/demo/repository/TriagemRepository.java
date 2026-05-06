package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.StatusTriagem;
import com.example.demo.entity.Triagem;

public interface TriagemRepository extends JpaRepository<Triagem, Long> {

    List<Triagem> findByPacienteIdOrderByDataTriagemDesc(Long pacienteId);

    List<Triagem> findAllByOrderByDataTriagemDesc();

    long countByStatus(StatusTriagem status);

    long countByPacienteId(Long pacienteId);
}
