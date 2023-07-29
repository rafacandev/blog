Standalone MySql with Docker
----------------------------

Very useful MySQL docker image with an external data folder named `volume-mysql` and which also allows connections from external hosts.

```bash
# Install Docker
sudo apt install docker.io
 
# Show Docker version
docker -v
 
# Install Docker Compose
sudo apt install docker-compose
 
# Show Docker Compose version
docker-compose --version
 
# Create folder for your docker image
mkdir -p ~/docker-mysql
cd ~/docker-mysql
 
##### Create a Dockerfile (see content below)
 
##### Create a docker-compose.yml (see content below)
 
# Start docker-compose
sudo docker-compose up -d
 
# Done, your docker container up and running!
 
# If you want to stop your container, enter:
sudo docker stop docker-mysql
 
# If you want to stop your container, enter:
sudo docker start docker-mysql
 
# If you want to backup your data you just need to copy/restore the folder 'volume-mysql'
```

`Dockerfile`
```bash
# Extend from mysql docker image
FROM mysql/mysql-server:5.7

### ENVIRONMENT VARIABLES

# Specifies a password that is set for the MySQL root account
ENV MYSQL_ROOT_PASSWORD root

# Allow connections from other hosts
ENV MYSQL_ROOT_HOST %
```

`docker-compose.yml`
```bash
version: '2'
services:
  docker-mysql:
    image: docker-mysql:0.1
    container_name: docker-mysql
    build:
      context: .
      dockerfile: ./Dockerfile
    ports:
     - "3306:3306"
    volumes:
     - ./volume-mysql:/var/lib/mysql
```
