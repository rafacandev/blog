Linux - Disable USB Auto Suspend
================================

On my Linux Mint distribution, I am not able to weak up my computer from suspension using my USB keyboard. This happens because Linux Mint disables the USB when the computer is suspended (good strategy if you want to save some energy, although inconvenient if you use an USB keyboard).

Below is a possible approach to disable USB autosuspend.

```bash
## Create a shell script to disable autosuspend for each USB port
sudo vim /etc/init.d/usb-disable-autosuspend.sh

## Content of /etc/init.d/usb-disable-autosuspend.sh
for i in /sys/bus/usb/devices/*/power/autosuspend;
do echo -1 > $i;
done

for j in /sys/bus/usb/devices/*/power/level;
do echo on > $j;
done

for k in /sys/bus/usb/devices/*/power/wakeup;
do echo enabled > $k;
done

## Save the file
## Grant execution permission
sudo chmod +x /etc/init.d/usb-disable-autosuspend.sh 

## Resister the shell script to run automatically during startup
sudo update-rc.d usb-disable-autosuspend.sh defaults 100
```

Now you should be able resume your computer with your USB keyboard.

If you notice that your computer restarts when you shutdown or suspend, then you also need to instruct the kernel to set `acpi=noirq` as follows:

```
vim /etc/default/grub

## Add acpi=noirq to GRUB_CMDLINE_LINUX_DEFAULT, example:
GRUB_CMDLINE_LINUX_DEFAULT="acpi=noirq quite splash"

## Update grub configuration
sudo update-grub2
```
