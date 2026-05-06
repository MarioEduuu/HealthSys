package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.PatientAuditLog;

public interface PatientAuditLogRepository extends JpaRepository<PatientAuditLog, Long> {
}
