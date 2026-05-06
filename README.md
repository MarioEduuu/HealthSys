# HealthSys Distribuido

O HealthSys Distribuido e uma aplicacao web para gestao hospitalar criada para a disciplina de Computacao Distribuida. O projeto entrega uma versao funcional com frontend React, servicos Spring Boot, API Gateway, PostgreSQL, Redis, Kafka, autenticacao JWT e observabilidade.

## Estado atual

O backend local de desenvolvimento continua no projeto `backend/healthsys-api`. No Docker Compose, essa mesma aplicacao e executada em containers separados por responsabilidade, criando uma topologia distribuida com API Gateway roteando para servicos logicos independentes.

Ja foram implementados:

- autenticacao com JWT;
- cadastro e login de usuarios;
- controle de acesso por perfil;
- listagem, atualizacao e ativacao/desativacao de usuarios;
- cadastro, listagem, busca, edicao e exclusao controlada de pacientes;
- bloqueio de exclusao de pacientes com registros vinculados;
- auditoria interna de alteracoes em pacientes;
- prontuario eletronico;
- consultas, exames, medicamentos e vacinas;
- teletriagem com classificacao de risco;
- notificacoes geradas a partir de eventos de triagem;
- notificacoes assincronas via Kafka no ambiente Docker;
- dashboard e relatorios com indicadores do backend;
- cache distribuido com Redis no ambiente Docker;
- invalidacao de cache quando dados importantes mudam;
- Kafka para eventos de triagem;
- fallback local quando Kafka estiver desabilitado;
- API Gateway Nginx roteando frontend e endpoints REST;
- servicos Docker separados para usuarios, pacientes, prontuario, triagem, notificacoes e dashboard;
- endpoints REST protegidos;
- tratamento global de erros;
- ajuste automatico de schema legado;
- frontend com rotas protegidas;
- colecao Postman para testes manuais;
- Docker Compose com API Gateway, PostgreSQL, Redis, Kafka, servicos backend, frontend, Prometheus, Grafana e ELK;
- templates Kubernetes para evolucao futura.

## Tecnologias

### Backend

- Java 17
- Spring Boot 4.0.5
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- Spring Validation
- Spring Cache
- Spring Kafka
- Spring Actuator
- JWT com `jjwt`
- BCrypt para senhas
- PostgreSQL
- Redis opcional
- Maven

### Frontend

- React 19
- Vite
- React Router
- Axios
- CSS puro em `frontend/src/App.css` e `frontend/src/index.css`
- Nginx no container de producao

### Infraestrutura

- Docker
- Docker Compose
- Nginx como API Gateway
- PostgreSQL 16
- Redis 7
- Kafka com Zookeeper
- Prometheus
- Grafana
- Elasticsearch
- Logstash
- Kibana
- Kubernetes como templates em `infra/k8s`

## O que instalar no computador

Para rodar localmente sem Docker:

- Git;
- JDK 17 ou superior;
- Maven 3.9 ou superior, ou o wrapper `mvnw.cmd` que ja vem no backend;
- Node.js 20 ou superior;
- npm;
- PostgreSQL 16 ou compativel;
- Postman ou Insomnia, opcional para testar a API.

Para rodar com Docker Compose:

- Docker Desktop.

Com Docker Compose, PostgreSQL, Redis, Kafka, Prometheus, Grafana e ELK sobem em containers. Para Kubernetes, instale tambem `kubectl` e um cluster local ou remoto.

## Estrutura

```text
HealthSys/
  backend/healthsys-api/       Backend Spring Boot
  frontend/                    Frontend React com Vite
  infra/
    api-gateway/               Configuracao Nginx do API Gateway
    prometheus/                Configuracao do Prometheus
    grafana/                   Provisionamento do Grafana
    elk/                       Configuracao do Logstash
    k8s/                       Templates Kubernetes
  postman/                     Colecao Postman
  docker-compose.yml           Ambiente completo em containers
  README.md                    Documentacao principal
```

## Rodando localmente

### Banco

Crie um banco PostgreSQL chamado `healthsys`.

Confira usuario, senha e URL em:

```text
backend/healthsys-api/src/main/resources/application.properties
```

O backend usa `spring.jpa.hibernate.ddl-auto=update`, entao as tabelas sao criadas/atualizadas quando a aplicacao inicia.

### Backend

```powershell
cd backend/healthsys-api
mvn spring-boot:run
```

Se o Maven nao estiver reconhecido:

```powershell
cd backend/healthsys-api
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

### Frontend

Use outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Rodando com Docker Compose

Na raiz do projeto:

```powershell
docker compose up --build
```

Para parar:

```powershell
docker compose down
```

Para parar e apagar o volume do banco:

```powershell
docker compose down -v
```

Use `down -v` com cuidado, porque apaga os dados do PostgreSQL.

No Docker Compose, o ponto de entrada principal e o API Gateway:

```text
http://localhost:8080
```

O gateway roteia:

- `/api/auth` e `/api/users` para `user-service`;
- `/api/patients`, `/api/pacientes` e `/patients` para `patient-service`;
- `/api/medical-records` e vacinas para `medical-record-service`;
- `/api/triages` para `triage-service`;
- `/api/notifications` para `notification-service`;
- `/api/dashboard` e `/actuator` para `dashboard-service`;
- demais rotas para o frontend.

Ao criar uma triagem pelo frontend, o fluxo distribuido e:

1. Frontend envia a requisicao para o API Gateway.
2. Gateway roteia para `triage-service`.
3. `triage-service` salva a triagem e publica o evento `triage.created` no Kafka.
4. `notification-service` consome o evento de forma assincrona.
5. `notification-service` cria a notificacao.
6. Dashboard e listagens usam Redis como cache distribuido.

## Portas

| Servico | Porta | URL |
| --- | --- | --- |
| Frontend | 5173 | `http://localhost:5173` |
| API Gateway | 8080 | `http://localhost:8080` |
| PostgreSQL | 5433 | `localhost:5433` |
| Redis | 6379 | `localhost:6379` |
| Kafka | 9092 | `localhost:9092` |
| Prometheus | 9090 | `http://localhost:9090` |
| Grafana | 3001 | `http://localhost:3001` |
| Elasticsearch | 9200 | `http://localhost:9200` |
| Kibana | 5601 | `http://localhost:5601` |

## Perfis

- `ADMIN`: gerencia usuarios e acessa a maior parte dos modulos;
- `PROFISSIONAL_SAUDE`: acessa prontuario, triagem, pacientes e notificacoes;
- `RECEPCAO`: cadastra e atualiza pacientes;
- `GESTOR`: acessa listagens, dashboard e relatorios.

## Endpoints principais

### Autenticacao

- `POST /api/auth/register`
- `POST /api/auth/login`

### Usuarios

- `GET /api/users`
- `GET /api/users/{id}`
- `PUT /api/users/{id}`
- `PATCH /api/users/{id}/status`

### Pacientes

- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/{id}`
- `GET /api/patients/search?nome=...`
- `PUT /api/patients/{id}`
- `DELETE /api/patients/{id}`

Pacientes com triagens, prontuario ou vacinas vinculadas nao sao excluidos por seguranca.

### Prontuario

- `POST /api/medical-records`
- `GET /api/medical-records/patient/{patientId}`
- `PUT /api/medical-records/{id}`
- `POST /api/medical-records/{id}/consultas`
- `POST /api/medical-records/{id}/exames`
- `POST /api/medical-records/{id}/medicamentos`
- `POST /api/patients/{patientId}/vacinas`
- `GET /api/patients/{patientId}/vacinas`

### Triagem

- `POST /api/triages`
- `GET /api/triages`
- `GET /api/triages/{id}`
- `GET /api/triages/patient/{patientId}`
- `PATCH /api/triages/{id}/status`

### Notificacoes

- `GET /api/notifications`
- `GET /api/notifications/{id}`
- `PATCH /api/notifications/{id}/read`

### Dashboard e observabilidade

- `GET /api/dashboard/summary`
- `GET /actuator/health`
- `GET /actuator/info`
- `GET /actuator/prometheus`

## Frontend

Rotas:

- `/login`
- `/dashboard`
- `/usuarios`
- `/pacientes`
- `/prontuario`
- `/triagens`
- `/notificacoes`
- `/relatorios`

O frontend guarda o token JWT no `localStorage` e envia as requisicoes autenticadas com:

```text
Authorization: Bearer <token>
```

Por padrao, a API usada pelo frontend e:

```text
http://localhost:8080
```

No Docker, essa URL aponta para o API Gateway. Rodando localmente sem Docker, ela aponta diretamente para o Spring Boot.

Para mudar:

```text
VITE_API_URL=http://localhost:8080
```

## Fluxo rapido de teste

1. Suba o backend e o frontend.
2. Cadastre um usuario `ADMIN`.
3. Faca login.
4. Cadastre um paciente.
5. Crie um prontuario.
6. Adicione consulta, exame, medicamento ou vacina.
7. Crie uma triagem.
8. Verifique notificacoes.
9. Confira dashboard e relatorios.

## Postman

A colecao esta em:

```text
postman/HealthSys.postman_collection.json
```

Use `Register`, depois `Login`, copie o token retornado para a variavel `token` e teste os demais modulos.

## Observabilidade

Com Docker Compose:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Kibana: `http://localhost:5601`

Credenciais padrao do Grafana:

- usuario: `admin`
- senha: `admin`

## Kubernetes

Os arquivos de `infra/k8s` sao templates. Antes de aplicar em um cluster real, ajuste:

- imagens Docker;
- secrets;
- configmaps;
- ingress;
- volumes persistentes;
- recursos de CPU/memoria;
- variaveis de ambiente.

## Problemas comuns

### Maven nao reconhecido

```powershell
cd backend/healthsys-api
.\mvnw.cmd spring-boot:run
```

### Frontend nao conecta no backend

Confira se o backend esta rodando em `http://localhost:8080` e se `VITE_API_URL` esta correto.

### Erro 401 ou permissao negada

Faca login novamente e confira se o usuario tem perfil suficiente para acessar a rota.

### Tabelas nao aparecem no banco

Pare e suba o backend novamente. O schema e atualizado no startup.

### Erro `usuarios_perfil_check`

O projeto possui correcao automatica em `LegacySchemaMigrationConfig`; reinicie o backend para aplicar.