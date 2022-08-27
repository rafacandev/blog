Linux Mint Tweaks
=================

Useful tweaks for linux distribution based on debian (ubuntu, mint, etc).

### Turn on the firewall
It is turned off by default. Normally, you just need to search for _firewall_ in your distribution menu.


### Useful Apps

Essential apps
```bash
sudo apt install vim curl git chromium-browser vlc vlc-plugin-fluidsynth gimp htop
```


### Remove 'unnecessary' apps
* `mono-runtime-common`: .NET Framework for Linux
* `gnome-orca`: screen reader
* `apt-xapian-index`: indexing application speeds up certain search operations but in general isn't a good trade-off
* `pidgin`: chatting app
* `hexchat`: chatting app
* `thunderbird`: email client
* `gnote`: postit notes

```bash
sudo apt-get remove mono-runtime-common gnome-orca apt-xapian-index pidgin hexchat thunderbird gnote
```


### Update the Kernel
```bash
sudo apt-add-repository -y ppa:cappelikan/ppa
sudo apt update
sudo apt install mainline
```

Run mainline from the GUI start menu.


### Reduce grub timeout
If you are using grub for boot management (e.g.: when you have a dual boot) you may want to reduce the default timeout.

```
sudo cp /etc/default/grub /etc/default/grub.bk
sudo vim /etc/default/grub
# Change the value of GRUB_TIMEOUT to 1
GRUB_TIMEOUT=1
sudo update-grub
```

### Increase swap file size
https://arcolinux.com/how-to-increase-the-size-of-your-swapfile/

```bash
# Turn off all swap processes
sudo swapoff -a

# Resize the swap to 20Gb
sudo dd if=/dev/zero of=/swapfile bs=1G count=20

# Make the file usable as swap
sudo mkswap /swapfile

# Check usage
free -m
```

### Change swapping tendency
The tendency to swap 60 is a good value for servers. For normal home use a lower value is more adequate.

```bash
# Check current value
cat /proc/sys/vm/swappiness
# Backup current configuration
sudo cp /etc/sysctl.conf /etc/sysctl.conf.bk
sudo vim /etc/sysctl.conf

# Add the following line
# Reduce the swap tendency 
vm.swappiness = 1
```

### Mount additional partitions at startup
If you have additional partitions you may want to mount them during startup. See more details at: [What Is the Linux fstab File, and How Does It Work?](http://www.howtogeek.com/howto/38125/htg-explains-what-is-the-linux-fstab-and-how-does-it-work/)

```bash
# List devices by UUID
sudo blkid

# Create a mount point
mkdir /home/YOUR_HOME_USER/files

# Add the partition in etc/fstab
# Mount extra HDD at startup
UUID=YOUR_UUID  /home/YOUR_HOME_USER/files  ext4  relatime,noexec  0  2
# Mount extra HDD at startup (alternative options)
LABEL=YOUR_LABEL /mnt/YOUR_DESIRED_FOLDER_NAME auto defaults,rw,user,x-gvfs-show,noauto 0 0
```

### Enable Hibernate
Based on this excellent tutorial: https://forums.linuxmint.com/viewtopic.php?t=273202

Lookup for your swap partition:
```
cat /etc/fstab
```

Backup your grub config:
```
sudo cp /etc/default/grub.bk /etc/default/grub
```

Edit your grub config:
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash resume=UUID=putYourSwapUUIDhere"
```

Update your grup:
```
sudo update-grub
```

### Install Virt Manager
```
sudo apt install virt-manager
```

### Java Development

Install SDKMAN
```
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk version
```

List available Java AdoptOpenJDK candiates:
```
sdk list java | grep adpt
```

Install Java AdoptOpenJDK:
```
sdk install java 11.0.11.j9-adpt
```

Install Maven:
```
sdk install maven
```

Install Gradle:
```
sdk install gradle
```

### Install Adobe Acrobat Reader
[Install Adobe Acrobat Reader on Ubuntu Distros](/posts/install-adobe-reader-on-ubuntu-based-distributions/README.md)


### Docker
Follow this guide if you are running Linux Mint:
[Install Docker on Linux Mint](/posts/intall-docker-on-linux-mint/README.md)


#### Configure docker to run without `sudo`.
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
docker run hello-world
```


### NodeJS via Node Version Manager
Github official page: https://github.com/nvm-sh/nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Need to exit and reopen the current terminal so the changes take effect
nvm install node
node -v
npm -v
```

### Intellij
```bash
wget https://download-cf.jetbrains.com/idea/ideaIC-2018.2.4.tar.gz
tar xfzv ideaIC-2018.2.4.tar.gz -C ~/dev/
mv ~/dev/idea-IC-182.4505.22/ ~/dev/intellij
~/dev/intellij/bin/idea.sh
```

Active tab color: `Action Context Menu (Ctrl + A) | Registry` search for `ide.new.editor.tabs.selection.color` and set it to something bright.

Add asterisk to tabs with modified tabs:
`Settings | Editor | Mark Modified tabs with asterisk`

### VirtualBox
Download and install [VirtualBox](https://www.virtualbox.org/wiki/Linux_Downloads).
After installing the guest additions, add your user to the vboxsf group

```
cat /etc/group | grep vboxsf
sudo usermod -aG vboxsf [YOUR_USERNAME]
```

Audio
=====

Install PipeWire
----------------
Steps to use [PipeWire](https://pipewire.org) instead of the default pulseaudio. *PipeWire* has better bluetooth support. See this tutorial for reference: https://linuxconfig.org/how-to-install-pipewire-on-ubuntu-linux

```bash
sudo add-apt-repository ppa:pipewire-debian/pipewire-upstream
sudo apt update
sudo apt install pipewire pipewire-audio-client-libraries
sudo apt install gstreamer1.0-pipewire libpipewire-0.3-{0,dev,modules} libspa-0.2-{bluetooth,dev,jack,modules} pipewire{,-{audio-client-libraries,pulse,media-session,bin,locales,tests}}
systemctl --user daemon-reload
systemctl --user --now disable pulseaudio.service pulseaudio.socket
systemctl --user --now enable pipewire pipewire-pulse
```

To revert the above changes:
```bash
sudo apt remove pipewire pipewire-audio-client-libraries
sudo apt remove gstreamer1.0-pipewire libpipewire-0.3-{0,dev,modules} libspa-0.2-{bluetooth,dev,jack,modules} pipewire{,-{audio-client-libraries,pulse,media-session,bin,locales,tests}}
systemctl --user daemon-reload
systemctl --user --now enable pulseaudio.service pulseaudio.socket
pactl info
```

Desktop Tweaks
==============

XFCE
---

### Install Dracula Theme
```bash
mkdir -p ~/.local/share/themes/

cd ~/Downloads/
wget -O dracula.zip https://github.com/dracula/gtk/archive/master.zip
unzip dracula.zip 
mv gtk-master ~/.local/share/themes/dracula
```

### Keyboard
```
Behavior > Repeat speed: 50
Application Shortcuts > xfce4-popup-whiskermenu: Super+Space
Application Shortcuts > xfce4-taskmanager: Super+M
Application Shortcuts > xfce4-terminal: Super+T
Application Shortcuts > xkill: Super+K
Application Shortcuts > exo-open --launch FileManager: Super+E
```

### Window Manager Keyboard
```
Keyboard > Raise window > Clear
Keyboard > Lower window > Clear
Keyboard > Move window to upper workspace > Clear
Keyboard > Move window to bottom workspace > Clear
Keyboard > Move window to left workspace > Clear
Keyboard > Move window to right workspace > Clear
Keyboard > Move window to previous workspace: Shift+Ctrl+Alt+Left
Keyboard > Move window to next workspace: Shift+Ctrl+Alt+Right
Keyboard > Move window to workspace 1 > Clear
Keyboard > Move window to workspace 2 > Clear
Keyboard > Move window to workspace 3 > Clear
Keyboard > Move window to workspace 4 > Clear
Keyboard > Move window to workspace 5 > Clear
Keyboard > Move window to workspace 6 > Clear
Keyboard > Move window to workspace 7 > Clear
Keyboard > Move window to workspace 8 > Clear
Keyboard > Move window to workspace 9 > Clear
Keyboard > Tile window to the top: Super+Up
Keyboard > Tile window to the bottom: Super+Down
Keyboard > Tile window to the left: Super+Left
Keyboard > Tile window to the right: Super+Right
Keyboard > Show Desktop: Super+D
Keyboard > Upper workspace > Clear
Keyboard > Bottom workspace > Clear
Keyboard > Left workspace > Clear
Keyboard > Right workspace > Clear
Keyboard > Next workspace: Ctrl+Alt+Right
Keyboard > Previous workspace: Ctrl+Alt+Left
Keyboard > Workspace 1 > Clear
Keyboard > Workspace 2 > Clear
Keyboard > Workspace 3 > Clear
Keyboard > Workspace 4 > Clear
Keyboard > Workspace 5 > Clear
Keyboard > Workspace 6 > Clear
Keyboard > Workspace 7 > Clear
Keyboard > Workspace 8 > Clear
Keyboard > Workspace 9 > Clear
Keyboard > Workspace 10 > Clear
Keyboard > Workspace 11 > Clear
Keyboard > Workspace 12 > Clear
Keyboard > Add workspace > Clear
Keyboard > Delete last workspace > Clear
```

Cinnamon
--------
Turn off effects
```
Menu Button >> Preferences >> Effects
Turn everything [off]

Menu button >> Preferences >> System Settings >> General
Disable compositing for full-screen windows [off]

Menu button >> Preferences >> Window Tiling [off]
```

### Disable Unwanted Shortcuts
The `Ctrl+Alt+Up` and `Ctrl+Alt+Down` are traditionally used with for toggle workspaces up and down but they conflic to many development IDEs.

```bash
## Lookup for shortcuts Ctrl+Alt+Up and Ctrl+Alt+Down
## gsettings list-recursively | grep -i "up\|down" | grep -i "Alt" | grep -i "Control"

gsettings set org.cinnamon.desktop.keybindings.wm switch-to-workspace-down []
gsettings set org.cinnamon.desktop.keybindings.wm switch-to-workspace-up []
```
