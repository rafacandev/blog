## Install
```bash
sudo apt install tmux
```

## TPM
Follow the steps described at https://github.com/tmux-plugins/tpm

## Fonts

Nerd Fonts is a great resource for pached fonts: https://github.com/ryanoasis/nerd-fonts

Install only Jet Brans Mono font:
```bash
mkdir -p ~/.local/share/fonts
cd ~/.local/share/fonts
curl -OL https://github.com/ryanoasis/nerd-fonts/releases/latest/download/JetBrainsMono.tar.xz
tar xvf JetBrainsMono.tar.xz
fc-cache -vf ~/.local/share/fonts
```

## Theme : Dracula
Dracula is my theme of choice: https://draculatheme.com/tmux

## Configuration
My final configuration file `~/.tmux.conf`

```
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'


# Basic styling
set -g window-style 'fg=colour253,bg=colour236'
set -g window-active-style 'fg=colour254,bg=colour235'


# Dracula
set -g @plugin 'dracula/tmux'
# dracula-plugins: battery, cpu-usage, git, gpu-usage, ram-usage, network, network-bandwidth, network-ping, attached-clients, network-vpn, weather, time, spotify-tui, kubernetes-context
set -g @dracula-plugins "git cpu-usage ram-usage battery time"
set -g @dracula-border-contrast true
set -g @dracula-show-powerline false


# Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
run '~/.tmux/plugins/tpm/tpm'
```


## Resources

https://github.com/rothgar/awesome-tmux

