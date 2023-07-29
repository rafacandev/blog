Samba Tutorial for Arch Linux
-----------------------------

```bash

# Install samba
sudo pacman -S samba

# Configure samba. See sample configuration file.
vim /etc/samba/smb.conf

# Test the configuration
testparm

# Add a samba user
sudo useradd -m sailormoon
sudo passwd sailormoon
sudo smbpasswd -a sailormoon

# List samba users
sudo pdbedit -L -v

# Create the shared folder
sudo mkdir /home/sailormoon/sambashare
sudo chown sailormoon:sailormoon /home/sailormoon/sambashare
sudo chgrp sailormoon:sailormoon /home/sailormoon/sambashare

# Start samba services
systemctl start smb.service
systemctl start nmb.service

# Get your IP address so you can access it remotely
ip address show

# Connect to the samba share with the client
smbclient \\\\localhost\\sailormoon -U sailormoon

# Test if you can write to the share
smb: \> mkdir temp
smb: \> exit

# Start samba services at booting time
systemctl enable smb.service
systemctl enable nmb.service

```


#### /etc/samba/smb.conf
```
# This is the main Samba configuration file. You should read the
# smb.conf(5) manual page in order to understand the options listed
#======================= Global Settings =====================================
[global]
   workgroup = SAILORGROUP
   server string = Sailor Moon Samba Server
   server role = standalone server

   log file = /var/log/samba/%m.log
   log level = 1
   max log size = 500
   dns proxy = no 
# This option is important for security. It allows you to restrict
# connections to machines which are on your local network. The
# following example restricts access to two C class networks and
# the "loopback" interface. For more examples of the syntax see
# the smb.conf man page
;   hosts allow = 192.168.1. 192.168.2. 127.

# Configure Samba to use multiple interfaces
# If you have multiple network interfaces then you must list them
# here. See the man page for details.
;   interfaces = 192.168.12.2/24 192.168.13.2/24 

#============================ Share Definitions ==============================
[sailormoon]
   comment = Sailor Moon Shared Directory
   path = /home/sailormoon/sambashare
   valid users = sailormoon
   public = no
   writable = yes
   printable = no
   create mask = 0765
```
