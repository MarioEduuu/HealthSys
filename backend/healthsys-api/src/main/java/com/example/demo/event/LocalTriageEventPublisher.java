package com.example.demo.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import com.example.demo.service.NotificationService;

@Component
@ConditionalOnMissingBean(name = "kafkaTriageEventPublisher")
public class LocalTriageEventPublisher implements TriageEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(LocalTriageEventPublisher.class);

    private final NotificationService notificationService;

    public LocalTriageEventPublisher(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void publish(TriageCreatedEvent event) {
        LOGGER.info("Evento de triagem tratado localmente: {}", event);
        notificationService.createFromTriageEvent(event);
    }
}
