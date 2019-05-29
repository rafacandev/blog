https://vitux.com/how-to-install-kvm-to-create-and-manage-virtual-machines-in-ubuntu/

https://www.linuxtechi.com/install-configure-kvm-ubuntu-18-04-server/

https://linuxconfig.org/install-and-set-up-kvm-on-ubuntu-18-04-bionic-beaver-linux


https://help.ubuntu.com/community/KVM/Installation





An output of `1` or anything greater than that indicates that your CPU can be set-up for using the virtualization technology. An output of `0` indicates the inability of your system to run KVM.

```
egrep -c ‘(svm|vmx)’ /proc/cpuinfo
```


Check if the virtualization technology is enabled on your system.

```
sudo apt install cpu-checker
sudo kvm-ok
```


Install KVM and its dependencies.
```
sudo apt install qemu-kvm libvirt-bin bridge-utils virt-manager
sudo apt install qemu qemu-kvm libvirt-bin  bridge-utils virt-manager
```


Add your user account as a KVM user. You can use virtual machines on KVM only if you are a root user or if you are part of the libvirt/libvirtd group. *Completely restart your system for the change to take effect*
```
sudo adduser $USER libvirtd
# or
sudo adduser $USER libvirt
```

Verifying successful installation
```
virsh -c qemu:///system list
service libvirtd status
```


```
apt install ebtables dnsmasq firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo systemctl restart libvirtd
```

```
sudo apt install qemu
sudo apt install qemu-utils
```



INVESTIGATE
```
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
sudo apt install gir1.2-spiceclientgtk-3.0
```
