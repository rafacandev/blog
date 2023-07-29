Pacman Fixes
============


Pacman Invalid or Corrupted Package
-----------------------------------

Recently I ran into an issue when running:

```bash
sudo pacman -Syu

:: Proceed with installation? [Y/n] 
(187/187) checking keys in keyring
(187/187) checking package integrity
error: failed to commit transaction (invalid or corrupted package
```

After some investigation I found out that a previous update was incompleted and left corrupted partial files. The solution is to delete those files with:

```bash
sudo find /var/cache/pacman/pkg/ -iname "*.part" -exec rm {} \;
```


Unlock the database
-------------------

Pacman creates a lock file during update. If you want to release the lock you should:

```bash
sudo rm -f /var/lib/pacman/db.lck
```
