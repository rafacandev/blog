List all commits in BRANCH-FORWARD not in BRANCH-BEHIND.
```bash
git log --pretty=format:"%h%x09%an%x09%ad%x09%s" --left-right --oneline BRANCH-BEHIND...BRANCH-FORWARD
```

Store credenticals.
```bash
git config credential.helper store
```

Forget stored credentials.
```bash
## If you want to unset your credential helper
git config --global --unset credential.helper
## If you want to clean the credential cache
git config credential.helper cache
```

Merge squash.
```bash
git checkout master
git merge --squash [YOUR_BRANCH]
git commit
```

Change default commit editor to <code>vim</code>.
```bash
git config --global core.editor "vim"
```

Using <code>meld</code> as merge tool.
```bash
sudo apt-get install meld
git mergetool --tool-help
git difftool
```

Clear local branches which no long exist in the remote.
```bash
git remote prune origin
```