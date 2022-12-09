Servidor de Arquivos Samba em Docker
------------------------------------
Neste post vamos criar um servidor de arquivos samba usando docker.
Na minha opinião, a principal vantagem deste método e a facilidade de recriar este servidor, pois podemos executar os mesmos passos, independente do sistema operacional.

A minha motivação particular foi montar um servidor de arquivos caseiro para eu guardar meus arquivos pessoais em um servidor remoto como muito espaço em disco.
Adicionalmente, fica muito fácil de transferir arquivos do meu celular para a minha pasta remota.
Finalmente, eu também costumo criar uma pasta publica para transferir arquivos entre membros da minha família (chega de ficar enviando arquivos anexos por e-mail).

Requirimentos
-------------
Precisaremos do **docker** e do **docker compose**.

Eu vou descrever os passos executados em um Linux, mas eu acredito que os passos no Windows sejam muito próximos. Por favor, comentem as diferenças se alguém aqui seguir este post pelo Windows.


### Instalação

#### docker
Aqui esta a pagina oficial em inglês para o *docker*:
https://docs.docker.com/engine/install/

Aqui um tutorial em português pelo Ubuntu (pare no passo 2):
[https://www.digitalocean.com/community/tutorials...](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-pt)

#### docker compose
Aqui esta a pagina oficial em inglês:
https://docs.docker.com/compose/install/

Aqui um tutorial em português pelo Ubuntu (pare no passo 1):
[https://www.digitalocean.com/community/tutorials...](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04-pt)

#### docker e docker compose pelo WSL
Aqui temos uma instalação pelo WSL: [https://www.tabnews.com.br/Yagasaki...](https://www.tabnews.com.br/Yagasaki/instalando-o-docker-no-wsl-2-sem-o-docker-desktop)

Objetivo
--------
Criar um servidor samba pelo docker com um compartilhamento publico e um compartilhamento privado protegido por usuário + senha.

Estrutura de Pastas e Arquivos
------------------------------
Vamos criar a seguinte estrutura de pastas e arquivos:

```
samba/
├── data
│   └── config.yml
├── docker-compose.yml
├── joao
│   └── arquivo-do-joao.txt
└── publico
    └── arquivo-publico.txt
```
* **samba**: Pasta raiz
* **samba/docker-compose.yml**: Arquivo de configuração do nossos serviços docker
* **samba/data**: Pasta para o funcionamento do servidor samba
* **samba/data/config.yml**: Configuração do servidor samba
* **samba/joao**: Pasta para o compartilhamento privado do usuário _joao_
* **samba/publico**: Pasta para o compartilhamento publico

Aqui os comandos para criar esta estrutura de pastas e arquivos:
```bash
mkdir -p samba/data
mkdir -p samba/joao
mkdir -p samba/publico
touch samba/data/config.yml
echo 'Um arquivo do joao' > samba/joao/arquivo-do-joao.txt
echo 'Um arquivo publico' > samba/publico/arquivo-publico.txt
touch samba/docker-compose.yml
```

Descrição do docker compose (docker-compose.yml)
------------------------------------------------
Colar este conteúdo no arquivo **samba/docker-compose.yml**:
```yaml
version: "3.5"

services:
  samba:
    image: crazymax/samba
    container_name: samba
    network_mode: host
    volumes:
      - "./data:/data"
      - "./publico:/samba/publico"
      - "./joao:/samba/joao"
    environment:
      - "SAMBA_LOG_LEVEL=0"
    restart: always
```

O *docker-compose.yml* descreve os serviços que serão rodados pelo docker.
Este arquivo e utilizado pelo docker para criar containers.
Por simplicidade, podemos pensar em containers como se fossem separadas maquinas virtuais;
no nosso caso, uma máquina virtual rodando um servidor samba.

Temos apenas um serviço chamado `samba` baseado na imagem `crazymax/samba`.
A documentação completa da imagem: https://github.com/crazy-max/docker-samba

Temos também volumes, que no nosso caso estão associadas com as pastas que criamos anteriormente.
Por exemplo: o volume `./publico:/samba/publico` diz que montaremos o conteúdo da pasta `./publico`
em uma pasta interna ao container chamada `/samba/publico`.


Descrição da configuração do servidor samba (config.yml)
------------------------------------------------
Colar este conteúdo no arquivo **config.yml**:
```yaml
auth:
  - user: joao
    group: joao
    uid: 1000
    gid: 1000
    password: debarro

global:
  - "force user = joao"
  - "force group = joao"

share:
  - name: publico
    comment: Compartilhamento publico
    path: /samba/publico
    browsable: yes
    readonly: no
    guestok: yes
    veto: no
    recycle: no
  - name: joao
    comment: Compartilhamento privado com arquivos do joao
    path: /samba/joao
    browsable: yes
    readonly: no
    guestok: no
    validusers: joao
    writelist: joao
    veto: no
    recycle: yes
```

O *config.yml* descreve a configuração do servidor samba.

O objeto `auth` descreve que teremos um usurário `joao` com a senha `debarro`.

O objeto `share` descreve os compartilhamentos.
Queremos um compartilhamento publico que aceita usuários anônimos `guestok: yes`.
Queremos um compartilhamento privado `guestok: yes` onde o joao e o único usuário com acesso `validusers: joao`.

Uma descricao mais detalhada do **config.yml**: https://github.com/crazy-max/docker-samba#configuration

Iniciar o Servidor
------------------
Com esta estrutura de pastas e arquivos apenas precisamos deste comando na mesma pasta onde o **samba/docker-compose.yml** esta presente:
```bash
docker compose up
```
Pronto o servidor está rodando, no meu _Linux Mint_ e eu consigo acessar pelo gerenciado de arquivos `smb://<ip>/<compartilhament>`.
Por exemplo, para acessar o compartilhamento privado `smb://192.168.0.10/joao/`, lembrando que o usuário e `joao` e a senha `debarro`.

No Windows, você pode seguir estes passos https://pt.wikihow.com/Acessar-Pastas-Compartilhadas-em-Uma-Rede onde o endereço de rede e `//192.168.0.10/joao/`. O nome do grupo de trabalho e `WORKGROUP` caso perguntado.


Nossa, este post ficou meio longo. Vou parando por aqui, caso tenham dúvidas ou sugestões bastar deixar nos comentários.



