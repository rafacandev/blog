Intellij Mix
------------

Recursivelly remove Intellij's projects and configuration files.
```bash
find . -name '.idea' -exec rm -rf {} \;
find . -name '*.iml' -exec rm -rf {} \;
```

MacOS, remove Intellij's cache and local settings.
```bash
rm -rf ~/Library/Application\ Support/JetBrains
rm -rf ~/Library/Caches/JetBrains
```
