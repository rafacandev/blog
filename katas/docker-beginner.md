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
    apt-get update
    apt-get install tree
    tree
    history
    exit

# Run the ubuntu image again and explain that a new container is created from the image and the tree command is not installed
docker run -it ubuntu bash
    tree

# Create an image based on an existing container
docker commit [CONTAINER_ID] ubuntu-with-tree

# Run our custom image
docker run -it ubuntu-with-tree bash
    tree
