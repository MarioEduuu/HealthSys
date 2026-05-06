package com.example.demo.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component("kafkaTriageEventPublisher")
@ConditionalOnProperty(name = "healthsys.kafka.publisher.enabled", havingValue = "true")
public class KafkaTriageEventPublisher implements TriageEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaTriageEventPublisher.class);

    private final KafkaTemplate kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topicName;

    public KafkaTriageEventPublisher(KafkaTemplate kafkaTemplate, ObjectMapper objectMapper,
            @Value("${healthsys.kafka.topics.triage-created}") String topicName) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topicName = topicName;
    }

    @Override
    public void publish(TriageCreatedEvent event) {
        try {
            kafkaTemplate.send(topicName, String.valueOf(event.triageId()), objectMapper.writeValueAsString(event));
            LOGGER.info("Evento de triagem publicado no topico {} para paciente {}", topicName, event.patientId());
        } catch (JsonProcessingException exception) {
            LOGGER.error("Falha ao serializar evento de triagem", exception);
        }
    }
}
