# Git no Docker
Execute o **git** em um contêiner Docker com o [alpine/git](https://hub.docker.com/r/alpine/git).

```bash
alias g='docker run -ti --rm \
  -u$(id -u):$(id -g) \
  -v /etc/passwd:/etc/passwd -v /etc/group:/etc/group \
  -v LOCAL_DIR_FOR_CONFIG:/home/${USER} \
  -v $(pwd):/git alpine/git'
```

## Passo a Passo
* **`alias g=`**: Cria um atalho chamado `g` para o comando completo dentro do terminal. Isso permite que você use apenas `g` no lugar do comando `docker run` completo, facilitando o uso do **git** dentro do contêiner. Por exemplo: `g status`.
* **`docker run -ti --rm`**: Executa um contêiner Docker em modo interativo, com terminal alocado, e será removido automaticamente após a execução.
* **`-u$(id -u):$(id -g) -v /etc/passwd:/etc/passwd -v /etc/group:/etc/group`**: Define o usuário e o grupo dentro do contêiner para que correspondam ao usuário e grupo do host (máquina local). Isso é útil para garantir que o contêiner tenha permissões adequadas ao acessar arquivos do sistema de arquivos do host. Os dois volumes (`/etc/passwd` e `/etc/group`) garantem que, ao executar o contêiner, o ambiente de usuário dentro dele seja configurado conforme o sistema host, evitando problemas de permissões.
* **`-v LOCAL_DIR_FOR_CONFIG:/home/${USER}`**: Cria um volume onde o diretório local `LOCAL_DIR_FOR_CONFIG` é montado como o diretório home dentro do contêiner para o usuário `${USER}`. Isso permite persistir configurações específicas do usuário, como arquivos de configuração do **git**.
* **`-v $(pwd):/git alpine/git`**: Monta o diretório atual (`$(pwd)`) no host para o diretório `/git` dentro do contêiner. Isso permite que o contêiner acesse e modifique arquivos no diretório atual do host, facilitando o uso do **git** diretamente sobre os arquivos locais.
