package com.example.demo.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "healthsys.kafka.consumer.enabled", havingValue = "true")
public class NotificationEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationEventConsumer.class);

    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    public NotificationEventConsumer(ObjectMapper objectMapper, NotificationService notificationService) {
        this.objectMapper = objectMapper;
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "${healthsys.kafka.topics.triage-created}")
    public void consumeTriageCreated(String payload) throws Exception {
        TriageCreatedEvent event = objectMapper.readValue(payload, TriageCreatedEvent.class);
        notificationService.createFromTriageEvent(event);
        LOGGER.info("Notificacao criada assincronamente a partir da triagem {}", event.triageId());
    }
}
