Linux on DELL L502X
-------------------

#### Slow WIFI
Slow internet on the wifi card. I noticed that disabling the power management solved the problem.

Change `wifi.powersave` to 2;
```
sudo vim /etc/NetworkManager/conf.d/default-wifi-powersave-on.conf
```

Possible values for the `wifi.powersave` field are:

```
NM_SETTING_WIRELESS_POWERSAVE_DEFAULT (0): use the default value
NM_SETTING_WIRELESS_POWERSAVE_IGNORE  (1): don't touch existing setting
NM_SETTING_WIRELESS_POWERSAVE_DISABLE (2): disable powersave
NM_SETTING_WIRELESS_POWERSAVE_ENABLE  (3): enable powersave
```

