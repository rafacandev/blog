Linux Mint Tweaks
-----------------

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
sudo apt-get remove mono-runtime-common gnome-orca apt-xapian-index pidgin hexchat thunderbird gnote sticky
```


### Update the Kernel
```bash
sudo apt-add-repository -y ppa:cappelikan/ppa
sudo apt update
sudo apt install mainline
```

Run mainline from the GUI start menu.


### Do nothing when lid is closed

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

### Bash
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
hibernate=['XF86Hibernate']
home=['<Super>e', 'XF86Explorer']
screensaver=@as []
shutdown=['XF86PowerOff']
suspend=@as []
terminal=['<Super>t']

[wm]
begin-move=@as []
begin-resize=@as []
maximize-horizontally=['<Super>y']
maximize-vertically=['<Super>u']
move-to-side-e=['<Super>Right']
move-to-side-n=['<Super>Up']
move-to-side-s=['<Super>Down']
move-to-side-w=['<Super>Left']
move-to-workspace-left=@as []
move-to-workspace-right=['<Super>p']
push-tile-down=@as []
push-tile-left=@as []
push-tile-right=@as []
push-tile-up=@as []
switch-monitor=['<Super>0', 'XF86Display']
switch-to-workspace-down=@as []
switch-to-workspace-left=['<Super>h']
switch-to-workspace-right=['<Super>l']
switch-to-workspace-up=['<Super>F1']
toggle-maximized=['<Super>m']
unmaximize=@as []
```
