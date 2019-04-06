Linux Tweaks
============

Useful tweaks for linux distribution based on debian (ubuntu, mint, etc).

### Turn on the firewall
It is turned off by default. Normally, you just need to search for _firewall_ in your distribution menu.


### Useful Apps

Essential apps
```bash
sudo apt-get install vim curl git maven artha chromium-browser
```

VLC (plus MIDI support)
```bash
sudo apt-get install vlc browser-plugin-vlc vlc-plugin-fluidsynth
```

### Remove 'unnecessary' apps
* `mono-runtime-common`: .NET Framework for Linux
* `gnome-orca`: screen reader
* `apt-xapian-index`: indexing application speeds up certain search operations but in general isn't a good trade-off
* `pidgin`: chatting app
* `hexchat`: chatting app
* `thunderbird`: email client

```bash
sudo apt-get remove mono-runtime-common gnome-orca apt-xapian-index pidgin hexchat thunderbird
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

# Add the partition in fstab
# Mount extra HDD at startup
UUID=YOUR_UUID  /home/YOUR_HOME_USER/files  ext4  relatime,noexec  0  2
```

### Install Oracle Java JDK 10
```bash
# List installed Java packages
dpkg --get-selections | grep -v deinstall | grep "jdk\|jre"

# Intall Oracle JDK
sudo add-apt-repository ppa:linuxuprising/java
sudo apt update
sudo apt install oracle-java10-installer
sudo apt install oracle-java10-set-default
java -version

# Setup JAVA_HOME
sudo vim /etc/profile.d/environment-variables.sh

## Example for Oracle JDK
export JAVA_HOME=/usr/lib/jvm/java-10-oracle/
export PATH=$PATH:$JAVA_HOME

## Example for OpenJDK
export JAVA_HOME=/usr/lib/jvm/java-1.10.0-openjdk-amd64/
export PATH=$PATH:$JAVA_HOME
```

### Install open-jdk
```
# List installed java packages
dpkg --get-selections | grep -v deinstall | grep "jdk\|jre"
# List java alternatives
sudo update-alternatives --config java

# Install jdk 11
sudo apt install openjdk-11-jdk openjdk-11-source

```

### Docker
```bash
sudo apt-get install docker-ce
# Add current user to docker group; so you don't need to use 'sudo' for every docker command issued
sudo usermod -aG docker $USER
```

Or follow this guide if you are running Linux Mint:
[Install Docker on Linux Mint](/posts/intall-docker-on-linux-mint/README.md)


### NodeJS via Node Version Manager
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
# Need to exit and reopen the current terminal so the changes take effect
exit
nvm install 9.0.0
node -v
npm -v
```

### VirtualBox
Download and install [VirtualBox](https://www.virtualbox.org/wiki/Linux_Downloads).

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

UI tweaks
---------

### Mate
You can improve graphical performance of your Linux Mint Mate like this:
```
Menu button >> Preferences >> Windows
Deselect "enable software compositing window manager"
```

### Cinnamon
Turn off effects
```
Menu Button >> Preferences >> Effects
Turn everything [off]

Menu button >> Preferences >> System Settings >> General
Disable compositing for full-screen windows [off]

Menu button >> Preferences >> Window Tiling [off]
```

#### Disable Unwanted Shortcuts
The `Ctrl+Alt+Up` and `Ctrl+Alt+Down` are traditionally used with for toggle workspaces up and down but they conflic to many development IDEs.

```bash
## Lookup for shortcuts Ctrl+Alt+Up and Ctrl+Alt+Down
## gsettings list-recursively | grep -i "up\|down" | grep -i "Alt" | grep -i "Control"

gsettings set org.cinnamon.desktop.keybindings.wm switch-to-workspace-down []
gsettings set org.cinnamon.desktop.keybindings.wm switch-to-workspace-up []
```
