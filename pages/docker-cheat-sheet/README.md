Docker Cheat Sheet
------------------

Remove any stopped containers and all unused images! *_Use at your own risk_*:
```bash
docker system prune -a
```

See https://docs.docker.com/get-started/part2/#recap-and-cheat-sheet-optional
```bash
# Create image using this directory's Dockerfile
docker build -t friendlyhello .
# Run "friendlyname" mapping port 4000 to 80
docker run -p 4000:80 friendlyhello
# Same thing, but in detached mode
docker run -d -p 4000:80 friendlyhello
# List all running containers
docker container ls
# List all containers, even those not running
docker container ls -a
# Gracefully stop the specified container
docker container stop
# Force shutdown of the specified container
docker container kill
# Remove specified container from this machine
docker container rm
# Remove all containers
docker container rm $(docker container ls -a -q)
# List all images on this machine
docker image ls -a
# Remove specified image from this machine
docker image rm
# Remove all images from this machine
docker image rm $(docker image ls -a -q)
# Log in this CLI session using your Docker credentials
docker login
# Tag  for upload to registry
docker tag  username/repository:tag
# Upload tagged image to registry
docker push username/repository:tag
# Run image from a registry
docker run username/repository:tag
```

```bash
# docker-compose
#===============
# Install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

docker-compose --version

# Build images and start containers in detached mode
docker-compose up --build -d

# Stop containers and remove all images
sudo docker-compose down --rmi all

# docker
#=======
# Attach to a running container
docker exec -it MY_CONTAINER bash

# Inspect a container
docker inspect MY_CONTAINER
```
