Docker for Beginners - Kata
---------------------------

In this Kata we are going to lear the basic Docker commands. We will see how to pull images, run containers and create our own custom containers.

Script
------
```bash
# Check the version
docker version

# List images
docker images

# Visit the DockerHub for the hello-world: https://hub.docker.com/_/hello-world

# Pull hello-world image
docker pull hello-world

# Run hello-world image
docker run hello-world

# Remove hello-world image (you might need to remove containers first)
docker images
docker image rm hello-world

# List containers
docker ps -a

# Remove container
docker rm [CONTAINER_ID]

# ==== ROTATE PARTICIPANTS ON THE KEYBOARD ==== #

# Pull and run ubuntu image from https://hub.docker.com/_/ubuntu
docker pull ubuntu

# Explain the we exited the container because there wasn't anything for the container to do
docker run ubuntu
docker ps -a

# Run the ubuntu image in interactive mode attaching to bash and install the unix 'tree' command inside the container
docker run -it ubuntu bash
    tree
    apt update
    apt install tree
    tree
    history
    exit

# Explain that a new container is created from the image and the 'tree' command is not installed
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

# ==== ROTATE PARTICIPANTS ON THE KEYBOARD ==== #

# Create a custom container and install apache2
docker run -it ubuntu bash
    apt update
    aptt install apache2
    curl http://localhost
    apt install curl
    curl http://localhost
    /etc/init.d/apache2 start
    curl http://localhost
    exit

# Create a custom image
docker commit [CONTAINER_ID] ubuntu-with-apache

# Run our custom ubuntu-with-apache
docker run -it ubuntu-with-apache bash
    /etc/init.d/apache2 start
    curl http://localhost
    # From a different terminal, let's show that we cannot access the website from outside the running container
    firefox http://localhost
    # Back to ubuntu-with-apache
    exit

# Run our custom ubuntu-with-apache binding the local port 81 to the container port 80
docker run -it -p 81:80 ubuntu-with-apache bash
    /etc/init.d/apache2 start
    curl http://localhost
    # From a different terminal, let's show that we cannot access the website from outside the running container
    firefox http://localhost:81
    # Back to ubuntu-with-apache
    exit


# ==== ROTATE PARTICIPANTS ON THE KEYBOARD ==== #

# Let's change the content of apache's default website
docker run -it -p 81:80 ubuntu-with-apache bash
    /etc/init.d/apache2 start
    echo "Hello from docker container" > /var/www/html/index.html
    # From a different terminal, let's show that we cannot access the website from outside the running container
    firefox http://localhost:81
    exit
    
# Let's mount the "/var/www/html/" using the current directory "$PWD" as a data volume
docker run -it -p 81:80 -v "$PWD":/var/www/html ubuntu-with-apache bash
    /etc/init.d/apache2 start
    # From a different terminal
    firefox http://localhost:81
    echo "Hello from a data volume" >> index.html
    firefox http://localhost:81
    exit
```



```
# Start the app in stand-alone mode
java -jar app/build/libs/docker-compose-kata-0.0.1-SNAPSHOT.jar

# Create a message in the app
curl -H "Content-Type: text/plain" -d "My message" http://localhost:8080/messages
curl http://localhost:8080/messages

# Create a file named Dockerfile-app with the following content
FROM java
CMD java -jar /jars/docker-compose-kata-0.0.1-SNAPSHOT.jar

# Build an image based on the file above
docker build -f Dockerfile-app -t app .

# Check that 'app' is now listed as an image
docker images

# Try to execute the image
docker run --name myapp -v $PWD/app/build/libs/:/jars -p 8080:8080 app

# Verify REST endpoints
curl -H "Content-Type: text/plain" -d "My message" http://localhost:8080/messages
curl http://localhost:8080/messages

# Create a file name Dockerfile-mydb with the following content
FROM mysql
ENV MYSQL_ROOT_PASSWORD password

# Build the database image
docker build -f Dockerfile-db -t db .

# Run the image we created
docker run --name mydb -it db

# Execute mysql command inside mydb
docker exec -it mydb mysql -p


```

