# HealthSys Distribuído — README Mestre de Implementação Completa

Este README é o guia mestre para desenvolvimento **completo** do HealthSys Distribuído, cobrindo a implementação ponta a ponta da plataforma conforme o projeto e o SRS já definidos pelo grupo.

Ele foi escrito para dois usos:

1. **Leitura humana**, para que qualquer integrante consiga seguir o projeto com calma.
2. **Execução por agente de código (Codex)**, com instruções suficientemente objetivas para construir a solução inteira.

---

## 1. Objetivo do sistema

O HealthSys Distribuído é uma plataforma web de gestão hospitalar distribuída para:

- cadastro e gestão de pacientes;
- prontuário eletrônico distribuído;
- teletriagem médica;
- monitoramento de pacientes;
- comunicação entre profissionais;
- relatórios e dashboard hospitalar;
- autenticação e controle de acesso;
- notificações associadas aos eventos do sistema.

---

## 2. Stack oficial do projeto

### Frontend
- React
- React Router DOM
- Axios
- CSS Modules ou Tailwind (escolher um padrão e manter)

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- Spring Validation
- Spring Cloud Gateway
- Spring Boot Actuator

### Persistência e mensageria
- PostgreSQL (banco principal)
- Redis (cache distribuído)
- Kafka (mensageria assíncrona)

### Infraestrutura
- Docker
- Docker Compose
- Kubernetes
- Prometheus + Grafana
- ELK Stack

### Testes e apoio
- Postman ou Insomnia
- JUnit + Mockito
- DBeaver ou pgAdmin

---

## 3. Entregável final esperado

Ao final da implementação, o sistema deve estar com:

- frontend React funcional;
- API Gateway funcional;
- serviço de usuários funcional;
- serviço de pacientes funcional;
- serviço de prontuário funcional;
- serviço de triagem funcional;
- serviço de notificações funcional;
- PostgreSQL persistindo os dados do sistema;
- Redis funcionando como cache;
- Kafka funcionando para eventos assíncronos;
- Docker Compose subindo todo o ambiente local;
- estrutura pronta para deploy em Kubernetes;
- monitoramento com Prometheus/Grafana;
- logs centralizados na ELK Stack;
- documentação básica de execução e uso.

---

## 4. Estrutura de pastas sugerida

```text
healthsys-distribuido/
├── frontend/
├── backend/
│   ├── api-gateway/
│   ├── user-service/
│   ├── patient-service/
│   ├── medical-record-service/
│   ├── triage-service/
│   ├── notification-service/
│   └── common-lib/                # opcional: classes compartilhadas e DTOs comuns
├── infra/
│   ├── docker/
│   ├── k8s/
│   ├── prometheus/
│   ├── grafana/
│   └── elk/
├── docs/
├── postman/
├── scripts/
├── docker-compose.yml
└── README.md
```

---

## 5. Ordem correta de implementação

A ordem abaixo deve ser seguida para evitar retrabalho.

### Fase 1 — Fundação do projeto
1. organizar repositório;
2. criar frontend base;
3. criar os microservices base;
4. configurar PostgreSQL;
5. configurar Redis;
6. configurar Kafka;
7. configurar Docker Compose;
8. configurar API Gateway.

### Fase 2 — Segurança e usuários
1. modelar entidade Usuario;
2. criar perfis de acesso;
3. implementar registro de usuário;
4. implementar login;
5. implementar geração e validação JWT;
6. proteger endpoints.

### Fase 3 — Pacientes
1. modelar Paciente;
2. criar CRUD completo;
3. criar histórico básico de cadastro;
4. integrar com frontend.

### Fase 4 — Prontuário
1. modelar Prontuario;
2. modelar Consulta;
3. modelar Exame;
4. modelar Medicamento;
5. modelar Vacina;
6. criar endpoints;
7. integrar com frontend.

### Fase 5 — Triagem
1. modelar Triagem;
2. implementar avaliação de sintomas;
3. implementar classificação de risco;
4. publicar eventos no Kafka;
5. integrar com frontend.

### Fase 6 — Notificações
1. criar serviço de notificações;
2. consumir eventos do Kafka;
3. persistir notificação;
4. expor endpoint para leitura de notificações;
5. integrar com frontend.

### Fase 7 — Dashboard e relatórios
1. criar agregações no backend;
2. montar cards e relatórios no frontend;
3. aplicar cache com Redis;
4. revisar performance.

### Fase 8 — Infra final
1. dockerizar tudo;
2. configurar Kubernetes;
3. configurar Prometheus/Grafana;
4. configurar ELK Stack;
5. criar documentação de execução.

---

## 6. Ambiente local — tudo que precisa ser instalado

### Obrigatório para todos
- Git
- Node.js LTS
- JDK 17+
- Maven
- Docker Desktop
- PostgreSQL (opcional local se preferir usar container)
- VS Code ou IntelliJ IDEA
- Postman ou Insomnia

### Recomendado
- DBeaver ou pgAdmin
- Lens ou Kubernetes Dashboard
- kubectl
- Minikube ou Kind

---

## 7. Configuração do ambiente local

### 7.1 Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd healthsys-distribuido
```

### 7.2 Criar o frontend

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios
```

### 7.3 Criar os microservices

Criar via Spring Initializr os serviços:

- api-gateway
- user-service
- patient-service
- medical-record-service
- triage-service
- notification-service

### Dependências mínimas por serviço

#### api-gateway
- Spring Cloud Gateway
- Spring Boot Actuator

#### user-service
- Spring Web
- Spring Data JPA
- Spring Security
- Validation
- PostgreSQL Driver
- Lombok
- JWT (dependência manual se necessário)
- Spring Boot Actuator

#### patient-service
- Spring Web
- Spring Data JPA
- Validation
- PostgreSQL Driver
- Lombok
- Spring Boot Actuator
- Redis

#### medical-record-service
- Spring Web
- Spring Data JPA
- Validation
- PostgreSQL Driver
- Lombok
- Spring Boot Actuator

#### triage-service
- Spring Web
- Spring Data JPA
- Validation
- PostgreSQL Driver
- Lombok
- Spring for Apache Kafka
- Spring Boot Actuator

#### notification-service
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- Spring for Apache Kafka
- Spring Boot Actuator

---

## 8. Configuração do PostgreSQL

Criar banco principal:

```sql
CREATE DATABASE healthsys;
```

Sugestão de usuário local:

- usuário: `postgres`
- senha: a configurada na máquina do desenvolvedor

### application.properties base para os serviços que usam banco

```properties
spring.application.name=user-service
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/healthsys
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

management.endpoints.web.exposure.include=health,info,prometheus
management.endpoint.health.show-details=always
```

Ajustar apenas `spring.application.name` e `server.port` em cada serviço.

---

## 9. Portas sugeridas

| Serviço | Porta |
|---|---:|
| Frontend React | 3000 ou 5173 |
| API Gateway | 8080 |
| User Service | 8081 |
| Patient Service | 8082 |
| Medical Record Service | 8083 |
| Triage Service | 8084 |
| Notification Service | 8085 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092 |
| Prometheus | 9090 |
| Grafana | 3001 |
| Kibana | 5601 |

---

## 10. Modelagem do domínio

## 10.1 Entidades obrigatórias

### Usuario
- id
- nome
- email
- senha
- perfil
- ativo
- createdAt
- updatedAt

### Paciente
- id
- nome
- dataNascimento
- sexo
- telefone
- email (opcional)
- endereco (opcional)
- createdAt
- updatedAt

### Prontuario
- id
- pacienteId
- historicoClinico
- observacoesGerais
- createdAt
- updatedAt

### Consulta
- id
- prontuarioId
- dataConsulta
- descricao
- conduta

### Exame
- id
- prontuarioId
- tipoExame
- dataExame
- resultado

### Medicamento
- id
- prontuarioId
- nome
- dosagem
- frequencia
- duracao

### Vacina
- id
- pacienteId
- nomeVacina
- dataAplicacao

### Atendimento
- id
- pacienteId
- tipoAtendimento
- data
- observacoes

### Triagem
- id
- pacienteId
- sintomas
- nivelRisco
- status
- dataTriagem

### Notificacao
- id
- titulo
- mensagem
- status
- dataEnvio
- usuarioDestinoId (se aplicável)
- pacienteId (se aplicável)

---

## 11. Perfis de usuário

Criar enum `PerfilUsuario` com:

- ADMIN
- PROFISSIONAL_SAUDE
- RECEPCAO
- GESTOR

Regras:
- ADMIN: gerencia usuários e acessa tudo;
- PROFISSIONAL_SAUDE: prontuário, triagem, visualização clínica, notificações;
- RECEPCAO: cadastro e atualização de pacientes, consulta de histórico cadastral;
- GESTOR: dashboards, relatórios e visão gerencial.

---

## 12. Serviço de Usuários e autenticação

## 12.1 O que deve existir

### Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `GET /users`
- `GET /users/{id}`
- `PUT /users/{id}`
- `PATCH /users/{id}/status`

## 12.2 Fluxo de autenticação

1. usuário faz login com email e senha;
2. sistema valida credenciais;
3. sistema gera JWT;
4. frontend salva token;
5. frontend envia token no header `Authorization: Bearer <token>` nas próximas requisições.

## 12.3 Exemplo de requisição — cadastro de usuário

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "nome": "Administrador Master",
  "email": "admin@healthsys.com",
  "senha": "123456",
  "perfil": "ADMIN"
}
```

### Resposta esperada

```json
{
  "id": 1,
  "nome": "Administrador Master",
  "email": "admin@healthsys.com",
  "perfil": "ADMIN",
  "ativo": true
}
```

## 12.4 Exemplo de requisição — login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@healthsys.com",
  "senha": "123456"
}
```

### Resposta esperada

```json
{
  "token": "jwt_aqui",
  "tipo": "Bearer",
  "usuario": {
    "id": 1,
    "nome": "Administrador Master",
    "email": "admin@healthsys.com",
    "perfil": "ADMIN"
  }
}
```

## 12.5 Segurança mínima obrigatória

- senha criptografada com BCrypt;
- rotas protegidas por perfil;
- CORS configurado para o frontend;
- Spring Security sem usar usuário padrão em memória.

---

## 13. Serviço de Pacientes

## 13.1 O que deve existir

### Endpoints
- `POST /patients`
- `GET /patients`
- `GET /patients/{id}`
- `PUT /patients/{id}`
- `DELETE /patients/{id}`
- `GET /patients/search?nome=`

## 13.2 Exemplo de criação de paciente

```http
POST /patients
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

```json
{
  "nome": "João da Silva",
  "dataNascimento": "1999-05-10",
  "sexo": "MASCULINO",
  "telefone": "85999999999"
}
```

### Resposta esperada

```json
{
  "id": 1,
  "nome": "João da Silva",
  "dataNascimento": "1999-05-10",
  "sexo": "MASCULINO",
  "telefone": "85999999999"
}
```

## 13.3 Histórico cadastral

Implementar ao menos uma destas opções:

### Opção A — mais simples
Criar tabela `patient_audit_log` com:
- id
- patientId
- campoAlterado
- valorAnterior
- valorNovo
- dataAlteracao
- usuarioId

### Opção B — mais rápida
Registrar alterações em tabela de logs genérica.

---

## 14. Serviço de Prontuário

## 14.1 O que deve existir

### Endpoints
- `POST /medical-records`
- `GET /medical-records/patient/{patientId}`
- `PUT /medical-records/{id}`
- `POST /medical-records/{id}/consultas`
- `POST /medical-records/{id}/exames`
- `POST /medical-records/{id}/medicamentos`
- `POST /patients/{patientId}/vacinas`
- `GET /patients/{patientId}/vacinas`

## 14.2 Fluxo mínimo

1. paciente existe;
2. profissional de saúde cria prontuário;
3. prontuário recebe consultas, exames, medicamentos;
4. vacinas podem ser registradas no histórico do paciente;
5. histórico clínico fica disponível para consulta.

## 14.3 Exemplo de criação de prontuário

```http
POST /medical-records
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

```json
{
  "pacienteId": 1,
  "historicoClinico": "Paciente sem comorbidades prévias.",
  "observacoesGerais": "Sem observações iniciais."
}
```

---

## 15. Serviço de Triagem

## 15.1 O que deve existir

### Endpoints
- `POST /triages`
- `GET /triages`
- `GET /triages/{id}`
- `GET /triages/patient/{patientId}`
- `PATCH /triages/{id}/status`

## 15.2 Regras mínimas

- toda triagem deve estar vinculada a um paciente;
- toda triagem deve registrar sintomas;
- toda triagem deve registrar classificação de risco;
- status possíveis: `ABERTA`, `EM_ANALISE`, `FINALIZADA`.

## 15.3 Exemplo de criação de triagem

```http
POST /triages
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

```json
{
  "pacienteId": 1,
  "sintomas": "Febre alta, dor de cabeça e náusea.",
  "nivelRisco": "ALTO",
  "status": "ABERTA"
}
```

### Comportamento adicional obrigatório
Ao criar a triagem, o serviço deve publicar evento Kafka.

---

## 16. Eventos Kafka

## 16.1 Tópicos obrigatórios

Criar pelo menos:

- `triage.created`
- `notification.created`
- `patient.updated` (opcional mas recomendado)

## 16.2 Evento de triagem criada

```json
{
  "eventType": "TRIAGE_CREATED",
  "triageId": 15,
  "patientId": 1,
  "riskLevel": "ALTO",
  "status": "ABERTA",
  "timestamp": "2026-04-16T10:30:00"
}
```

## 16.3 Regras

- o `triage-service` publica o evento;
- o `notification-service` consome o evento;
- o `notification-service` gera notificação persistida;
- o frontend consulta notificações via REST.

---

## 17. Serviço de Notificações

## 17.1 O que deve existir

### Endpoints
- `GET /notifications`
- `GET /notifications/{id}`
- `PATCH /notifications/{id}/read`

## 17.2 Fluxo

1. evento chega pelo Kafka;
2. serviço interpreta evento;
3. cria notificação;
4. frontend busca notificações;
5. usuário marca como lida.

## 17.3 Exemplo de notificação persistida

```json
{
  "id": 10,
  "titulo": "Nova triagem registrada",
  "mensagem": "Paciente 1 possui triagem com risco ALTO.",
  "status": "NAO_LIDA",
  "dataEnvio": "2026-04-16T10:30:20"
}
```

---

## 18. API Gateway

## 18.1 O que deve fazer

- centralizar entrada da aplicação;
- rotear para cada serviço;
- permitir autenticação por JWT (validação centralizada ou repassada);
- servir de ponto único para o frontend.

## 18.2 Rotas sugeridas

- `/api/auth/**` -> user-service
- `/api/users/**` -> user-service
- `/api/patients/**` -> patient-service
- `/api/medical-records/**` -> medical-record-service
- `/api/triages/**` -> triage-service
- `/api/notifications/**` -> notification-service

## 18.3 Exemplo de configuração conceitual

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://user-service:8081
          predicates:
            - Path=/api/auth/**,/api/users/**
        - id: patient-service
          uri: http://patient-service:8082
          predicates:
            - Path=/api/patients/**
```

---

## 19. Redis

## 19.1 Onde usar

Aplicar cache, no mínimo, em:

- listagem de pacientes;
- dashboard hospitalar;
- consulta resumida de notificações.

## 19.2 Estratégia mínima

- usar `@Cacheable` em consultas intensas;
- invalidar cache em criação/edição/exclusão.

---

## 20. Frontend React

## 20.1 Páginas obrigatórias

- Login
- Dashboard
- Usuários
- Pacientes
- Prontuário
- Triagem
- Notificações
- Relatórios

## 20.2 Estrutura sugerida

```text
frontend/src/
├── api/
├── components/
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Users/
│   ├── Patients/
│   ├── MedicalRecords/
│   ├── Triage/
│   ├── Notifications/
│   └── Reports/
├── routes/
├── hooks/
├── context/
└── utils/
```

## 20.3 Fluxo obrigatório de autenticação

1. tela de login envia credenciais;
2. salva token no `localStorage` ou `sessionStorage`;
3. Axios interceptor injeta token no header;
4. rotas privadas validam autenticação;
5. logout remove token e limpa contexto.

## 20.4 Telas mínimas por módulo

### Login
- email
- senha
- botão entrar

### Dashboard
- total de pacientes
- total de triagens abertas
- total de notificações não lidas
- atalhos para módulos

### Usuários
- cadastro de usuário
- listagem de usuários
- status e perfil

### Pacientes
- formulário de cadastro
- listagem
- busca por nome
- edição e exclusão

### Prontuário
- visualizar prontuário do paciente
- adicionar consulta
- adicionar exame
- adicionar medicamento
- registrar vacina

### Triagem
- criar triagem
- visualizar triagens
- filtrar por status e risco

### Notificações
- listar notificações
- marcar como lida

### Relatórios
- cards resumidos
- tabelas simples de apoio

---

## 21. Requisições HTTP mínimas para testar tudo

## 21.1 Registro de usuário

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Administrador Master",
    "email": "admin@healthsys.com",
    "senha": "123456",
    "perfil": "ADMIN"
  }'
```

## 21.2 Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@healthsys.com",
    "senha": "123456"
  }'
```

## 21.3 Criar paciente

```bash
curl -X POST http://localhost:8080/api/patients \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João da Silva",
    "dataNascimento": "1999-05-10",
    "sexo": "MASCULINO",
    "telefone": "85999999999"
  }'
```

## 21.4 Criar prontuário

```bash
curl -X POST http://localhost:8080/api/medical-records \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": 1,
    "historicoClinico": "Paciente sem comorbidades.",
    "observacoesGerais": "Nenhuma observação crítica."
  }'
```

## 21.5 Criar triagem

```bash
curl -X POST http://localhost:8080/api/triages \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": 1,
    "sintomas": "Febre e tosse",
    "nivelRisco": "MEDIO",
    "status": "ABERTA"
  }'
```

## 21.6 Listar notificações

```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 22. Dockerização

## 22.1 Cada serviço deve ter seu Dockerfile

### Exemplo backend

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Exemplo frontend

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 22.2 docker-compose.yml deve subir

- frontend
- api-gateway
- user-service
- patient-service
- medical-record-service
- triage-service
- notification-service
- postgres
- redis
- zookeeper (se necessário)
- kafka
- prometheus
- grafana
- elasticsearch
- logstash
- kibana

---

## 23. Kubernetes

## 23.1 O que precisa existir

Criar manifests ou charts para:

- deployments;
- services;
- configmaps;
- secrets;
- ingress;
- volumes, se necessário.

## 23.2 No mínimo criar

- `api-gateway-deployment.yaml`
- `user-service-deployment.yaml`
- `patient-service-deployment.yaml`
- `medical-record-service-deployment.yaml`
- `triage-service-deployment.yaml`
- `notification-service-deployment.yaml`
- `postgres-deployment.yaml`
- `redis-deployment.yaml`
- `kafka-deployment.yaml`

---

## 24. Monitoramento e logs

## 24.1 Prometheus

Todos os serviços devem expor métricas com Actuator.

### Endpoint esperado
- `/actuator/prometheus`

## 24.2 Grafana

Criar dashboards mínimos para:
- disponibilidade dos serviços;
- uso de CPU/memória;
- contagem de requisições;
- latência média.

## 24.3 ELK

Todos os serviços devem enviar logs estruturados.

Campos mínimos nos logs:
- timestamp
- serviceName
- level
- message
- traceId (se possível)

---

## 25. Testes

## 25.1 Backend

Criar:
- testes unitários para services;
- testes de controller;
- testes de autenticação;
- testes básicos de integração.

## 25.2 Frontend

Criar ao menos:
- testes dos componentes críticos;
- testes de rota protegida;
- testes do fluxo de login.

## 25.3 Testes manuais mínimos

### Usuários
- cadastrar usuário
- logar
- acessar rota protegida

### Pacientes
- cadastrar
- editar
- excluir
- listar

### Prontuário
- criar prontuário
- adicionar consulta/exame/medicamento
- consultar prontuário

### Triagem
- criar triagem
- classificar risco
- mudar status

### Notificações
- gerar evento
- consumir evento
- notificação aparecer
- marcar como lida

---

## 26. Critérios de pronto

O projeto só pode ser considerado pronto quando:

- todos os serviços principais existirem;
- autenticação JWT estiver funcionando;
- CRUD de usuários e pacientes estiver funcionando;
- prontuário estiver funcional;
- triagem estiver funcional;
- notificações estiverem sendo geradas a partir do Kafka;
- frontend consumir o gateway, não serviços soltos;
- Docker Compose subir todo o ambiente local;
- Prometheus/Grafana e ELK estiverem acessíveis;
- documentação de execução estiver atualizada.

---

## 27. O que o Codex deve fazer em ordem

1. criar a estrutura inteira do repositório;
2. gerar todos os projetos base;
3. configurar PostgreSQL, Redis e Kafka localmente via Docker Compose;
4. implementar `user-service` completo com JWT;
5. implementar `patient-service` completo;
6. implementar `medical-record-service` completo;
7. implementar `triage-service` completo com produção de eventos Kafka;
8. implementar `notification-service` completo com consumo de eventos Kafka;
9. implementar `api-gateway` com roteamento;
10. implementar frontend React completo;
11. integrar frontend ao gateway;
12. aplicar cache com Redis onde fizer sentido;
13. dockerizar tudo;
14. preparar manifests de Kubernetes;
15. configurar monitoramento e logs;
16. criar README de execução final;
17. deixar exemplos de requisições e coleção Postman.

---

## 28. O que o desenvolvedor humano deve conferir ao longo do caminho

- se as tabelas estão sendo criadas corretamente;
- se o JWT está sendo emitido e validado;
- se o gateway está roteando para os serviços certos;
- se Kafka está entregando os eventos;
- se o frontend está usando as rotas do gateway;
- se os containers sobem sem erro;
- se Prometheus lê métricas;
- se Kibana mostra logs.

---

## 29. Próximo nível, se sobrar tempo

Depois do core completo, podem ser adicionados:

- QR Code para identificação do paciente;
- relatórios mais ricos;
- dashboard mais avançado;
- documentação de usuário em PDF;
- deploy em nuvem.

---

## 30. Resumo final

Para este projeto ficar realmente completo, o grupo deve garantir:

- arquitetura distribuída real;
- backend dividido em serviços;
- autenticação JWT;
- banco PostgreSQL funcional;
- Kafka funcional;
- Redis funcional;
- React funcional;
- Docker funcional;
- Kubernetes preparado;
- monitoramento e logs ativos.

Este README deve ser tratado como o contrato de implementação do projeto.
