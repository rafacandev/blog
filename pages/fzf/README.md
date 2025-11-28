## Install fzf (if not already installed)

```bash
# Check if fzf is installed
which fzf

# If not installed, install via your package manager:
# Ubuntu/Debian:
sudo apt install fzf

# Or install from GitHub for latest version:
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

## Create a unified file/directory explorer function

Add this comprehensive function to your `~/.bashrc` file:

```bash
# Unified file and directory explorer with drill-down capability
_fzf_explore() {
    local current_dir="."
    local selected
    
    while true; do
        # List both files and directories with type indicators
        local items=$(find "$current_dir" -maxdepth 1 \( -type f -o -type d \) 2>/dev/null | \
            sed "s|^$current_dir/||" | \
            while IFS= read -r item; do
                if [[ "$item" == "." ]]; then
                    continue
                fi
                full_path="$current_dir/$item"
                if [[ -d "$full_path" ]]; then
                    echo "📁 $item/"
                else
                    echo "📄 $item"
                fi
            done | sort)
        
        # Add parent directory option if not in root
        if [[ "$current_dir" != "." ]]; then
            items="📁 ../"$'\n'"$items"
        fi
        
        # Show fzf with custom key bindings
        selected=$(echo "$items" | fzf \
            --height 60% \
            --reverse \
            --border \
            --header "Navigate: ←/→ to drill down/up, Enter to select, Esc to cancel" \
            --bind "right:execute(_fzf_drill_down \"$current_dir\" {})+abort" \
            --bind "left:execute(_fzf_go_up \"$current_dir\")+abort" \
            --expect "right,left" \
            --layout reverse-list \
            --margin 5%)
        
        # Handle the result
        if [[ -z "$selected" ]]; then
            # User cancelled
            return 1
        fi
        
        local key=$(echo "$selected" | head -1)
        local choice=$(echo "$selected" | tail -1)
        
        if [[ "$key" == "right" ]]; then
            # Drill down into directory
            local clean_choice=$(echo "$choice" | sed 's/^📁 //' | sed 's/^📄 //')
            if [[ "$choice" =~ ^📁 ]]; then
                if [[ "$clean_choice" == "../" ]]; then
                    current_dir=$(dirname "$current_dir")
                    [[ "$current_dir" == "." ]] || current_dir="."
                else
                    current_dir="$current_dir/${clean_choice%/}"
                fi
                continue
            fi
        elif [[ "$key" == "left" ]]; then
            # Go up one directory
            current_dir=$(dirname "$current_dir")
            [[ "$current_dir" == "." ]] || current_dir="."
            continue
        else
            # Selection made - clean up the choice and insert
            local clean_choice=$(echo "$choice" | sed 's/^📁 //' | sed 's/^📄 //')
            local final_path="$current_dir/$clean_choice"
            
            # Normalize path
            if [[ "$current_dir" == "." ]]; then
                final_path="$clean_choice"
            fi
            
            # Remove trailing slash for directories
            final_path=${final_path%/}
            
            # Smart quoting - add quotes if filename has spaces
            if [[ "$final_path" =~ [[:space:]] ]]; then
                final_path="\"$final_path\""
            fi
            
            # Insert at cursor position
            local left=${READLINE_LINE:0:$READLINE_POINT}
            local right=${READLINE_LINE:$READLINE_POINT}
            READLINE_LINE="${left}${final_path}${right}"
            READLINE_POINT=$(( ${#left} + ${#final_path} ))
            break
        fi
    done
}

# Bind Ctrl+E to trigger the unified explorer
bind -x '"\C-e": _fzf_explore'
```

## Apply the configuration

```bash
# Reload your bash configuration
source ~/.bashrc

# Or restart your terminal
```

## Usage Examples

Now you can use the unified explorer:

1. **Type**: `cat ` → **Press Ctrl+E** → Navigate with arrow keys → **Press Enter** to select file
2. **Type**: `cp ` → **Press Ctrl+E** → Navigate to source → **Press Enter** → Type space → **Press Ctrl+E** → Navigate to destination
3. **Navigation**:
   - **Up/Down**: Go up and down the list
   - **Right Arrow**: Enter/drill down into a directory
   - **Left Arrow**: Go up to parent directory  
   - **Enter**: Select current item (file or directory)
   - **Esc**: Cancel selection
   - **Visual indicators**: 📁 for directories, 📄 for files