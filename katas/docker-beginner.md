```
# Check the version
docker version

# List images
docker images

# Visit the webpage for 'hello-world' image in docker hub: https://hub.docker.com/_/hello-world

# Pull hello-world image
docker pull hello-world

# Run hello-world image from https://hub.docker.com/_/hello-world
docker run hello-world

# Remove hello-world image (you might need to remove containers first)
docker images
docker image rm hello-world

# List containers
docker ps -a

# Remove container
docker rm [CONTAINER_ID]

# Pull ubuntu image from https://hub.docker.com/_/ubuntu
docker pull ubuntu

# Run the ubuntu image, attatch to its bash and install the tree command in the container
docker run ubuntu
docker ps -a
docker run -it ubuntu bash
    tree
    apt update
    apt install tree
    tree
    history
    exit

# Run the ubuntu image again and explain that a new container is created from the image and the tree command is not installed
docker run -it ubuntu bash
    tree
    exit

# Create an image based on an existing container
docker commit [CONTAINER_ID] ubuntu-with-tree

# Run the custom image previously created
docker run -it ubuntu-with-tree bash
    tree
    exit

# Remove all containers
docker rm $(docker ps -a -q)

# Create a custom container running apache2
docker run -it ubuntu bash
    apt update
    aptt install apache2
    curl http://localhost
    apt install curl
    curl http://localhost
    /etc/init.d/apache2 start
    curl http://localhost
    exit

