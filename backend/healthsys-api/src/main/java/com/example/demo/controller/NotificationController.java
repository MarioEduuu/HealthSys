package com.example.demo.controller;

import java.util.List;


import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.NotificacaoResponse;
import com.example.demo.service.NotificationService;

@Validated
@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificacaoResponse> listarTodas() {
        return notificationService.listarTodas();
    }

    @GetMapping("/{id}")
    public NotificacaoResponse buscarPorId(@PathVariable Long id) {
        return notificationService.buscarPorId(id);
    }

    @PatchMapping("/{id}/read")
    public NotificacaoResponse marcarComoLida(@PathVariable Long id) {
        return notificationService.marcarComoLida(id);
    }
}
