How to Create a Git Server
==========================

Create a private Git server using Docker and [Gogs](https://gogs.io/docs).

```bash
# Create a folder which will contain the necessary files
mkdir -p gogs/volume-gogs

# Create the a file named Dockerfile (copy and paste the content below)
vi Dockerfile

# Create the a file named Dockerfile (copy and paste the content below)
vi docker-compose.yml

# Start docker using docker-compose.yml
sudo docker-compose up -d
```

`Dockerfile`
```
# Extend from gogs
FROM gogs/gogs:0.11.34
```

`docker-compose.yml`
```yaml
version: '2'
services:
  gogs:
    image: gogs:0.1
    container_name: gogs
    build:
      context: .
      dockerfile: ./Dockerfile
    ports:
     - "3030:3000"
    volumes:
     - ./volume-gogs:/data
```

Open http://localhost:3030 and follow the installation steps on the screen.
