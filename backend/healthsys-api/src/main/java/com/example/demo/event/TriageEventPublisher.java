package com.example.demo.event;

public interface TriageEventPublisher {

    void publish(TriageCreatedEvent event);
}
