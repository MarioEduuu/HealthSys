package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Notificacao;
import com.example.demo.entity.StatusNotificacao;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findAllByOrderByDataEnvioDesc();

    long countByStatus(StatusNotificacao status);
}
