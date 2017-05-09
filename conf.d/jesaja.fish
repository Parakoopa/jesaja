set jesaja_FILENAME ~/austausch/.jesaja

set jesaja_bible_get__r;
set jesaja_load__r;

function jesaja_next -d "Display the next verse and advance"
  # todo actual current verse
  __jesaja_load
  jesaja_bible_get $jesaja_load__r[4] $jesaja_load__r[5] $jesaja_load__r[6]
  if [ $status -ne 0 ]
    printf (set_color F00)"Konnte nicht mit Server verbinden, läuft er?"(set_color normal)"\n"
  else
    __jesaja_save_next
    __jesaja_printverse
  end
end

function jesaja_current -d "Display the current verse"
  # todo actual current verse
  __jesaja_load
  jesaja_bible_get $jesaja_load__r[1] $jesaja_load__r[2] $jesaja_load__r[3]
  if [ $status -ne 0 ]
    printf (set_color F00)"Konnte nicht mit Server verbinden, läuft er?"(set_color normal)"\n"
  else
    __jesaja_printverse
  end
end

function jesaja_bible_get -d "Get a specific verse"
  set -l bnumber $argv[1]
  set -l cnumber $argv[2]
  set -l vnumber $argv[3]
  set jesaja_bible_get__r (curl "http://localhost:3055/fish/$bnumber/$cnumber/$vnumber" 2> /dev/null)
  return $status # not really needed, but added anyway to make clear.
end

function __jesaja_greeting -d "Display the current verse as greeting"
  echo
  jesaja_next
  echo
end

function __jesaja_printverse
  printf (set_color yellow)"»"$jesaja_bible_get__r[1]"«"(set_color green)"\n  - "$jesaja_bible_get__r[2]" "$jesaja_bible_get__r[3]","$jesaja_bible_get__r[4](set_color normal)"\n"
  #" ("$jesaja_bible_get__r[5]")\n"
end

function __jesaja_save_next
  echo "$jesaja_load__r[4]"\n"$jesaja_load__r[5]"\n"$jesaja_load__r[6]"\n"$jesaja_bible_get__r[5]"\n"$jesaja_bible_get__r[6]"\n"$jesaja_bible_get__r[7]" > $jesaja_FILENAME
end

function __jesaja_load
  if [ ! -f $jesaja_FILENAME ]
    # First three are current, next three are next
    echo 1\n1\n1\n1\n1\n1 > $jesaja_FILENAME;
  end
  set jesaja_load__r (cat $jesaja_FILENAME);
end

if status --is-interactive
  __jesaja_greeting
end
