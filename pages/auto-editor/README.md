# auto-editor
Use o [auto-editor](https://github.com/WyattBlue/auto-editor) pelo docker.

Crie um arquivo docker:

[dockerfile](./dockerfile)
```dockerfile
FROM python:3
WORKDIR /app
RUN pip install auto-editor
ENTRYPOINT ["auto-editor"]
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
alias auto-editor='docker run --rm -v $(pwd):/app auto-editor auto-editor'
```

Exemplos:

Auto cortar onde o audio estiver silencioso com uma margem de `0.5s` o arquivo `input.mkv` como `output.mkv`:
```sh
auto-editor -m 0.5s -o output.mkv input.mkv 
```

Auto acelerar em 3 vezes onde o audio estiver silencioso com uma margem de `0.5s` o arquivo `input.mkv` como `output.mkv`:
```sh
auto-editor -m 0.5s -s 3 -o output.mkv input.mkv 
```

Shell script para auto editar o arquivo `input.mkv` como `output.mkv`:
```sh
SOURCE=$(realpath "$1")
DESTINATION=$(realpath "$2")

echo "auto editing from $SOURCE to $DESTINATION"

docker run --rm \
  -v "$SOURCE":"$SOURCE" \
  -v "/temp":"/app/temp" \
  auto-editor \
  auto-editor --no-open -o "/app/temp/destination.mkv" "$SOURCE"

cp /temp/destination.mkv "$DESTINATION"
```

Shell script para auto editar o arquivo mais recent de um diretorio para o outro:
```sh
DIR="$1"

# Check if the provided argument is a valid directory
if [ ! -d "$DIR" ]; then
    echo "Error: '$DIR' is not a valid directory."
    exit 1
fi


# Find the most recent file in the directory
SOURCE=$(ls -t "$DIR"*.mkv 2>/dev/null | head -n 1)

# Check if the directory is empty
if [ -z "$SOURCE" ]; then
    echo "No files found in '$SOURCE'."
    exit 2
else
    echo "Most recent file: $SOURCE"
fi


DESTINATION="$2"
DESTINATION_FILE="$DESTINATION"/$(basename "$SOURCE")".auto.mkv"

echo "Auto editing from $SOURCE to $DESTINATION_FILE"

docker run --rm \
  -v $(realpath $SOURCE):/app/source.mkv \
  -v "/temp":"/app/temp" \
  auto-editor \
  auto-editor --no-open --edit audio:0.02 -m 0.4s,0.4s -o /app/temp/destination.mkv /app/source.mkv

cp /temp/destination.mkv $DESTINATION_FILE
```