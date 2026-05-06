Os manifests desta pasta sao templates para a arquitetura distribuida descrita no README mestre.

Estado atual:

- o repositorio possui frontend React;
- o backend funcional atual esta consolidado em `backend/healthsys-api`;
- os arquivos abaixo preparam a nomenclatura e os contratos de deploy para a futura separacao em microservicos.

Antes de aplicar em um cluster real, ajuste:

- imagens Docker publicadas;
- Secrets e ConfigMaps;
- rotas de Ingress;
- volumes persistentes para PostgreSQL e Kafka.
