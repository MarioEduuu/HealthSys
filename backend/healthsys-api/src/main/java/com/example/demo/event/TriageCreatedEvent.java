package com.example.demo.event;

import java.time.LocalDateTime;

public record TriageCreatedEvent(
        String eventType,
        Long triageId,
        Long patientId,
        String patientName,
        String riskLevel,
        String status,
        LocalDateTime timestamp
) {
}
