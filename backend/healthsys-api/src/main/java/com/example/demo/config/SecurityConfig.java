package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**", "/auth/**", "/actuator/health", "/actuator/info",
                                "/actuator/prometheus").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "GESTOR")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/patients/**", "/api/pacientes/**", "/patients/**")
                        .hasAnyRole("ADMIN", "RECEPCAO", "PROFISSIONAL_SAUDE", "GESTOR")
                        .requestMatchers(HttpMethod.POST, "/api/patients/**", "/api/pacientes/**", "/patients/**")
                        .hasAnyRole("ADMIN", "RECEPCAO")
                        .requestMatchers(HttpMethod.PUT, "/api/patients/**", "/api/pacientes/**", "/patients/**")
                        .hasAnyRole("ADMIN", "RECEPCAO")
                        .requestMatchers(HttpMethod.DELETE, "/api/patients/**", "/api/pacientes/**", "/patients/**")
                        .hasAnyRole("ADMIN", "RECEPCAO")
                        .requestMatchers("/api/medical-records/**", "/api/patients/*/vacinas")
                        .hasAnyRole("ADMIN", "PROFISSIONAL_SAUDE")
                        .requestMatchers("/api/triages/**").hasAnyRole("ADMIN", "PROFISSIONAL_SAUDE")
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "GESTOR")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
