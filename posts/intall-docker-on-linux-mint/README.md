Install Docker on Linux Mint
============================

If you are trying to install Docker on your Linux Mint distribution you will notice that the official instructions will not work.

The official instructions are not going to work correctly because Mint won't return the expected result when using `$(lsb_release -cs)` it should read the `UBUNTU_CODENAME from /etc/os-release` instead.

Hence I decided to create a quick shell script to facilitate the process.

`install-docker.sh`
```bash
#!/bin/bash
UBUNTU_CODENAME=$(grep "UBUNTU_CODENAME" /etc/os-release | awk -F'=' '{print $2}')

echo "Trying to install docker. See official website for more details."
echo "https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#install-using-the-repository"
echo "Found UBUNTU_CODENAME=$UBUNTU_CODENAME"

echo "Installing dependencies"
apt-get install linux-image-generic linux-image-extra-virtual
apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

echo "Installing repository"
# Chose which repository matches your distribution. Default is arch=amd64
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $UBUNTU_CODENAME stable"
# add-apt-repository "deb [arch=armhf] https://download.docker.com/linux/ubuntu $UBUNTU_CODENAME -cs stable"
# add-apt-repository "deb [arch=s390x] https://download.docker.com/linux/ubuntu$ $UBUNTU_CODENAME stable"

echo "Updating repository"
apt-get update

echo "Installing docker"
apt-get install docker-ce
```