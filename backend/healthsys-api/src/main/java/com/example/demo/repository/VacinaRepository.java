package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Vacina;

public interface VacinaRepository extends JpaRepository<Vacina, Long> {

    List<Vacina> findByPacienteIdOrderByDataAplicacaoDesc(Long pacienteId);

    long countByPacienteId(Long pacienteId);
}
