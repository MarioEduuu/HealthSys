package com.example.demo.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class LegacySchemaMigrationConfig {

    @Bean
    public ApplicationRunner legacySchemaMigrationRunner(JdbcTemplate jdbcTemplate) {
        return args -> {
            ensureUsuarioColumns(jdbcTemplate);
            ensurePacienteColumns(jdbcTemplate);
        };
    }

    private void ensureUsuarioColumns(JdbcTemplate jdbcTemplate) {
        if (!tableExists(jdbcTemplate, "usuarios")) {
            return;
        }

        jdbcTemplate.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ativo BOOLEAN");
        jdbcTemplate.execute("UPDATE usuarios SET ativo = TRUE WHERE ativo IS NULL");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN ativo SET DEFAULT TRUE");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN ativo SET NOT NULL");

        jdbcTemplate.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");
        jdbcTemplate.execute("UPDATE usuarios SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN created_at SET NOT NULL");

        jdbcTemplate.execute("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");
        jdbcTemplate.execute("UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");
        jdbcTemplate.execute("ALTER TABLE usuarios ALTER COLUMN updated_at SET NOT NULL");

        ensureUsuarioPerfilConstraint(jdbcTemplate);
    }

    private void ensurePacienteColumns(JdbcTemplate jdbcTemplate) {
        if (!tableExists(jdbcTemplate, "pacientes")) {
            return;
        }

        jdbcTemplate.execute("ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS email VARCHAR(255)");
        jdbcTemplate.execute("ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS endereco VARCHAR(255)");

        jdbcTemplate.execute("ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");
        jdbcTemplate.execute("UPDATE pacientes SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL");
        jdbcTemplate.execute("ALTER TABLE pacientes ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP");
        jdbcTemplate.execute("ALTER TABLE pacientes ALTER COLUMN created_at SET NOT NULL");

        jdbcTemplate.execute("ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");
        jdbcTemplate.execute("UPDATE pacientes SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL");
        jdbcTemplate.execute("ALTER TABLE pacientes ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP");
        jdbcTemplate.execute("ALTER TABLE pacientes ALTER COLUMN updated_at SET NOT NULL");
    }

    private boolean tableExists(JdbcTemplate jdbcTemplate, String tableName) {
        Boolean exists = jdbcTemplate.queryForObject(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                      AND table_name = ?
                )
                """,
                Boolean.class,
                tableName);

        return Boolean.TRUE.equals(exists);
    }

    private void ensureUsuarioPerfilConstraint(JdbcTemplate jdbcTemplate) {
        if (!columnExists(jdbcTemplate, "usuarios", "perfil")) {
            return;
        }

        try {
            jdbcTemplate.execute("ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_perfil_check");
            jdbcTemplate.execute(
                    """
                    ALTER TABLE usuarios
                    ADD CONSTRAINT usuarios_perfil_check
                    CHECK (perfil IN ('ADMIN', 'PROFISSIONAL_SAUDE', 'RECEPCAO', 'GESTOR'))
                    """);
        } catch (Exception e) {
            // Ignora erro se outro container já criou a constraint simultaneamente
        }
    }

    private boolean columnExists(JdbcTemplate jdbcTemplate, String tableName, String columnName) {
        Boolean exists = jdbcTemplate.queryForObject(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = ?
                      AND column_name = ?
                )
                """,
                Boolean.class,
                tableName,
                columnName);

        return Boolean.TRUE.equals(exists);
    }
}
