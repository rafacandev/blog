---
title: My Linux Mint Setup
description: My Linux Mint setup for software development
order: 2
---


# Linux Mint Tweaks

Useful tweaks for linux distribution based on debian (ubuntu, mint, etc).

### Turn on the firewall
It is turned off by default. Normally, you just need to search for _firewall_ in your distribution menu.

### Apt Install Essential

Essential apps
```bash
sudo apt install vim curl git vlc vlc-plugin-fluidsynth gimp htop virt-manager
```

```bash
flatpak install flathub com.brave.Browser
```

### Apt Remove Bloat
* `mono-runtime-common`: .NET Framework for Linux
* `apt-xapian-index`: indexing application speeds up certain search operations but in general isn't a good trade-off
* `pidgin`: chatting app
* `hexchat`: chatting app
* `thunderbird`: email client
* `gnote`: postit notes

```bash
sudo apt remove mono-runtime-common apt-xapian-index pidgin hexchat thunderbird gnote sticky
```

### Do nothing when laptop lid is closed

Edit `/etc/systemd/logind.conf` and set `HandleLidSwitch=ignore`
```
cp /etc/systemd/logind.conf /etc/systemd/logind.conf.bk
echo 'HandleLidSwitch=ignore' >> /etc/systemd/logind.conf
```

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

### Ghostty
See [Ghostty Install](https://ghostty.org/docs/install/binary#ubuntu)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/mkasberg/ghostty-ubuntu/HEAD/install.sh)"
```

### Bash Improvements

#### Yazi
Download and instal `.deb` files: https://github.com/sxyazi/yazi/releases 

Install extra options:
```bash
apt install ffmpeg 7zip jq poppler-utils fd-find ripgrep fzf zoxide imagemagick
```

Create a keyboard shortcut:
*.bashrc*
```
# Change dir with yazi bound to ctrl+e
function cd-yazi() {
        local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
        command yazi "$@" --cwd-file="$tmp"
        IFS= read -r -d '' cwd < "$tmp"
        rm -f -- "$tmp"

        # Insert at cursor position
        local final_path=$cwd
        local left=${READLINE_LINE:0:$READLINE_POINT}
        local right=${READLINE_LINE:$READLINE_POINT}
        READLINE_LINE="${left}${final_path}${right}"
        READLINE_POINT=$(( ${#left} + ${#final_path} ))
}
bind -x '"\C-e": cd-yazi'
```

### Calendar

```bash
sudo apt install ncal
cp ~/.bashrc ~/.bashrc.bk
echo "alias cal='ncal -C3'" >> ~/.bashrc
```

#### Mix

*.inputrc*
```
# Ctrl-Delete: delete next word
"\e[3;5~": shell-kill-word

# Ctrl-Backspace: delete previous word
"\C-H": shell-backward-kill-word
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

Desktop Tweaks
==============

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

### Keyboard Shortcuts

Export shortcuts:
```sh
dconf dump /org/cinnamon/desktop/keybindings/ > dconf-settings.conf
```

Import shortcuts:
```sh
dconf load /org/cinnamon/desktop/keybindings/ < dconf-settings.conf
```

My `dconf-settings.conf`
```conf
[/]
looking-glass-keybinding=@as []

[media-keys]
terminal=['<Super>t']

[wm]
maximize=@as []
maximize-horizontally=['<Super>h']
maximize-vertically=['<Super>y']
minimize=['<Super>comma']
move-to-side-e=['<Super>Right']
move-to-side-n=['<Super>Up']
move-to-side-s=['<Super>Down']
move-to-side-w=['<Super>Left']
move-to-workspace-left=['<Super>u']
move-to-workspace-right=['<Super>p']
push-tile-down=@as []
push-tile-left=@as []
push-tile-right=@as []
push-tile-up=@as []
switch-monitor=['XF86Display']
switch-to-workspace-left=['<Super>j']
switch-to-workspace-right=['<Super>semicolon']
toggle-maximized=['<Super>m']
```
