#!/bin/bash

# Create a .kanata directory in the home directory
mkdir -p ~/.kanata

# Download the kanata-linux-x64.zip file
wget https://github.com/jtroo/kanata/releases/download/v1.10.0/linux-binaries-x64-v1.10.0.zip -O ~/.kanata/linux-binaries-x64-v1.10.0.zip

# Unzip the downloaded file
unzip ~/.kanata/linux-binaries-x64-v1.10.0.zip -d ~/.kanata/

# Make the kanata binary executable
chmod +x ~/.kanata/linux-binaries-x64-v1.10.0/kanata

# --- Steps to avoid using sudo ---

echo "To run kanata without sudo, we need to set up some permissions."
echo "You may be asked for your password."

# Create uinput group if it doesn't exist
if ! getent group uinput >/dev/null; then
    sudo groupadd uinput
fi

# Add user to input and uinput groups
sudo usermod -aG input $USER
sudo usermod -aG uinput $USER

# Add udev rule for uinput
echo 'KERNEL=="uinput", MODE="0660", GROUP="uinput", OPTIONS+="static_node=uinput"' | sudo tee /etc/udev/rules.d/99-kanata.rules

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Load uinput module
sudo modprobe uinput

# Copy the simple.kbd configuration file
echo "Copying simple.kbd to ~/.kanata/kanata.kbd"
cp simple.kbd ~/.kanata/kanata.kbd

echo "Permissions have been set up. You may need to log out and log back in for the group changes to take effect."
echo "After logging back in, you can run kanata using: ~/.kanata/kanata_linux_x64 --cfg ~/.kanata/kanata.kbd"


# Run the kanata binary
# ~/.kanata/kanata_linux_x64 --cfg ~/.kanata/kanata.kbd
