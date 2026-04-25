Bash script to alert when is your turn on Mabiweb games:

```bash
wget 'http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=81541&op=view_game_reset' -O mabiweb.log
cat mabiweb.log | grep Players | grep -o -P 'lukard.{0,5}' > players.txt
cat mabiweb.log | grep Players | grep -o -P 'nations.{0,5}' >> players.txt
cat mabiweb.log | grep Players | grep -o -P 'ng701.{0,5}' >> players.txt

ACTIVE_PLAYER=$(cat players.txt | grep -o -P '.{0,10}B>' | cut -c1-5)

echo "ACTIVE PLAYYER: $ACTIVE_PLAYER"

if [ "$ACTIVE_PLAYER" == "lukard" ]; then
  echo "LUKARD is the active player"
  speaker-test -l 1 -P 800 -t sine -f 350
fi
```
