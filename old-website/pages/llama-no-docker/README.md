# Servidor Llama No Docker

Este guia mostra como executar o Llama em um ambiente Docker expondo o servidor REST. Uma excelente opção para rodar um modelo de linguagem (LLM) localmente e integrá-lo a outras aplicações.

### Configuração do Docker Compose
Em um diretório de sua máquina, crie um arquivo chamado `docker-compose.yml` com o seguinte conteúdo:

[docker-compose.yml](./docker-compose.yml)
```yml
version: '3.8'

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ./ollama:/root/.ollama
```

### Preparação do Volume
No mesmo diretório, crie um subdiretório chamado ollama. Esse subdiretório será usado para persistir os dados do container, permitindo que ele seja reiniciado sem a necessidade de baixar os modelos novamente.

```bash
mkdir ollama
```

### Inicializando o Docker Compose
Execute o comando abaixo para iniciar o Docker Compose:

```bash
docker compose up
```
O Docker irá baixar as dependências necessárias e iniciar o servidor anexado ao terminal atual.

### Baixando o Modelo
Em outro terminal, faça o download de um dos [modelos disponíveis](https://github.com/ollama/ollama?tab=readme-ov-file#model-library)). Para este guia, utilizaremos o modelo `llama3.2`:

```bash
curl http://localhost:11434/api/pull -d '{"model": "llama3.2"}'
```

### Interagindo com o Llama
Agora você pode interagir com o Llama usando curl:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt":"Quantos minutos tem uma hora?",
  "stream": false
}'
```

```json
{
  "model": "llama3.2",
  "created_at": "2024-11-30T02:56:10.335418081Z",
  "response": "Uma hora é igual a 60 minutos.",
  "done": true,
}
```
