# Git Com Múltiplas Chaves SSH
Crie múltiplas chaves ssh para trabalhar com múltiplas contas do GitHub na mesma máquina.

## Crie multiplas chaves ssh
Crie as chaves ssh
```sh
ssh-keygen -t ed25519 -C "rafacandev@gmail.com"
```

Mova a chave para uma pasta de configuracao:
```sh
mv ~/.ssh ~/dev/git-config/rafacandev
```

Adicione as chaves no ssh agent
```sh
ssh-add ~/dev/git-config/rafacandev/.ssh/id_ed25519
```

Crie um script para alternar as configurações:
```sh
cp -r /home/moon/dev/git-config/rafacandev/.ssh ~
cp /home/moon/dev/git-config/rafacandev/.gitconfig ~
ssh-add /home/moon/dev/git-config/rafacandev/.ssh/id_ed25519
```

Crie um alias para alternar as configurações:
```sh
alias git-rafacandev='sh /home/moon/dev/git-config/rafacandev.sh'
```

# Resources
[Mastering Multiple SSH Keys for Git: A Comprehensive Guide](https://matifzia.medium.com/mastering-multiple-ssh-keys-for-git-a-comprehensive-guide-d7387d31d911)