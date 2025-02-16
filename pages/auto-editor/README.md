# auto-editor
Use o [auto-editor](https://github.com/WyattBlue/auto-editor) pelo docker.

Crie um arquivo docker:

[dockerfile](./dockerfile)
```dockerfile
FROM python:3
WORKDIR /app
RUN pip install auto-editor
CMD ["auto-editor"]
VOLUME /app
```

Compile uma imagem do `auto-editor`:
```sh
docker build -t auto-editor .
```

Rode o `auto-editor` pelo docker. Por exemple, `auto-editor --version`: 
```sh
docker run --rm -v $(pwd):/app auto-editor auto-editor --version
```

Cria um alias para facilitar execuções:
```sh
alias auto-editor='docker run --rm -v $(pwd):/app auto-editor auto-editor --no-open'
```