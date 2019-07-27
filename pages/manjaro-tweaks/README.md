Linux Manjaro Tweaks
====================

Update/Upgrade
--------------
Update and upgrade installed packages.
```bash
pacman -Syu
```

pamac
-----
Open `pamac` (aka _Add/Remove Software_) and change the following preferences:

- Preferences > AUR > Enable AUR support
- Preferences > AUR > Check for updates from AUR
- Preferences > Official Repositories > Use mirrors from

Still on `pamac` install the following software:

- Repositories > chromium
- AUR > chrome-chrome

Apps
----

### Essential apps
```bash
sudo pacman -S vim curl git maven gradle
```

### VLC (plus MIDI support)
```bash
sudo pacman -S install vlc browser-plugin-vlc vlc-plugin-fluidsynth
```

Reduce Grub Timeout
-------------------
If you are using grub for boot management (e.g.: when you have a dual boot) you may want to reduce the default timeout.
```bash
sudo cp /etc/default/grub /etc/default/grub.bk
sudo vim /etc/default/grub
# Change the value of GRUB_TIMEOUT to 1
GRUB_TIMEOUT=1
sudo update-grub
```

### Change swapping tendency
The tendency to swap 60 is a good value for servers. For normal home use a lower value is more adequate.
```bash
sudo vim /etc/sysctl.d/100-manjaro.conf

# Reduce the swap tendency 
vm.swappiness = 1
```

Alias
-----
```bash
echo 'alias ll="ls -la"' >> ~/.bashrc
```

Settings
--------
Setting files are located at: `~/.config/xfce4/xfconf/xfce-perchannel-xml/`

### Keyboard
```
Behavior > Repeat speed: 50
Application Shortcuts > xfce4-popup-whiskermenu: Super+Space
Application Shortcuts > xfce4-taskmanager: Super+M
Application Shortcuts > xfce4-terminal: Super+T
Application Shortcuts > xkill: Super+K
Application Shortcuts > exo-open --launch FileManager: Super+E
```

### Window Manager
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

KVM
---
Install KVM and Virtual Machine Manager with this [basic tutorial](https://www.fosslinux.com/2484/how-to-install-virtual-machine-manager-kvm-in-manjaro-and-arch-linux.htm)

On the host:
```bash
sudo pacman -S virt-manager qemu vde2 ebtables dnsmasq bridge-utils openbsd-netcat
sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service
```

On the guest:
Recomended reading: [Preparing Arch Linux Guest](https://wiki.archlinux.org/index.php/QEMU#Preparing_an_(Arch)_Linux_guest):
```bash
sudo pacman -S spice-vdagent xf86-video-qxl
```

**If you are running Manjaro as your guest OS**
Remove _xorg_ configuration as described [here](https://superuser.com/questions/1464585/how-to-increase-display-resolution-in-qemu-kvm-via-virt-manager-on-manjaro-host):
```bash
sudo rm /etc/X11/xorg.conf.d/90-mhwd.conf
```

Add recomended modules to `/etc/mkinitcpio.conf`:
```bash
sudo vim /etc/mkinitcpio.conf
# Add the following modules
MODULES=(virtio virtio_blk virtio_pci virtio_net)
```