KVM on Linux
------------

Tutorial for installing KVM on Linux Mint 19.1 (Tessa) XFCE which is based on Ubuntu Bionic.

### Verify compatibility

Check cpuinfo with the command below. An output of `1` or greater indicates that your CPU can be set-up for using the virtualization technology. An output of `0` indicates the inability of your system to run KVM.
```
egrep -c "(svm|vmx)" /proc/cpuinfo
```

Check if the virtualization technology is enabled on your system.
```
sudo apt update
sudo apt install cpu-checker
sudo kvm-ok
```

The expected output is:
```
INFO: /dev/kvm exists
KVM acceleration can be used
```

Installation
------------

### Install qemu
```
sudo apt install build-essential libepoxy-dev libdrm-dev libgbm-dev libx11-dev libvirglrenderer-dev libpulse-dev libsdl2-dev python python-dev libpixman-1-dev build-essential

wget https://download.qemu.org/qemu-4.0.0.tar.xz -O qemu.tar.xz

mkdir qemu && tar -xf qemu.tar.xz -C qemu --strip-components=1

cd qemu

./configure --enable-sdl --enable-opengl --enable-virglrenderer --enable-system --enable-modules --audio-drv-list=pa --target-list=x86_64-softmmu --enable-kvm

make -j$(nproc)


sudo apt-get install checkinstall
sudo checkinstall make install
sudo apt-get install ./*.deb


sudo make install

cd ..
```

### Install Virtual Machine Manager

Install KVM and its dependencies.
```
sudo apt install libvirt-daemon-system libvirt-clients
sudo apt install qemu-kvm libvirt-bin bridge-utils virt-manager
sudo apt install qemu-utils
sudo apt install gir1.2-spiceclientgtk-3.0
```

Add your user as a KVM user. You can use virtual machines on KVM only if you are a root user or if you are part of the libvirt/libvirtd group. *Completely restart your system for the change to take effect*
```
sudo adduser $USER libvirt
# If the above command fails; then try the command below
# Because the user group varies depending on the installed version
sudo adduser $USER libvirtd
```

Verifying if the installation was successful
```
virsh -c qemu:///system list
service libvirtd status
```

Start firewalld
```
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo systemctl restart libvirtd
```

At this point you should be able to run Virtual Machine Manager from you start menu.


References
----------
https://zingmars.info/2018/07/15/Virgl-with-qemu-and-libvirt-on-ubuntu/

https://vitux.com/how-to-install-kvm-to-create-and-manage-virtual-machines-in-ubuntu/

https://www.linuxtechi.com/install-configure-kvm-ubuntu-18-04-server/

https://linuxconfig.org/install-and-set-up-kvm-on-ubuntu-18-04-bionic-beaver-linux

https://help.ubuntu.com/community/KVM/Installation

You may also need these dependencies depending on your needs
```
sudo apt install qemu
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
sudo apt install ebtables dnsmasq firewalld
```

### Display Comparison

*QXL* Repainting: 4 stars; mouse accelarion 3 stars; mouse hickups: 3 starts
*Virtio without 3d acceleration* Repainting: 4 stars; mouse accelarion 3 stars; mouse hickups: 3 starts
*VMVGA* Repainting: 4 stars; mouse accelarions: 3 stars; mouse hickups: 2 starts
*VGA* Repainting: 4 stars; mouse acceleration: 4 stars; mouse hickups: 2 stars
*Cirrus* Repaiting: 3 stars; mouse acceleration: 3 starts: mouse hickups: 2 starts
