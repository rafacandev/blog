Good article explaning it in more details: https://unix.stackexchange.com/questions/3505/how-to-install-adobe-acrobat-reader-in-debian

```bash
wget ftp://ftp.adobe.com/pub/adobe/reader/unix/9.x/9.5.5/enu/AdbeRdr9.5.5-1_i386linux_enu.deb
sudo dpkg --add-architecture i386
sudo apt update
sudo dpkg -i AdbeRdr9.5.5-1_i386linux_enu.deb
sudo apt install -f
sudo apt-get install libxml2:i386
acroread
```
