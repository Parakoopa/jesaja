set -l BOOK_FILE "bible.xml"

set bible_get__r;

function jesaja_last -d "Display the current verse"
  # todo actual current verse
  __jesaja_bible_get 45 1 1
  if [ $status -ne 0 ]
    printf (set_color F00)"Konnte nicht mit Server verbinden, läuft er?"(set_color normal)"\n"
  else
    printf (set_color yellow)"»"$bible_get__r[1]"«"(set_color green)"\n  - "$bible_get__r[2]" "$bible_get__r[3]","$bible_get__r[4](set_color normal)"\n"
    #" ("$bible_get__r[5]")\n"
  end
end

function __jesaja_bible_get -d "Get a specific verse"
  set -l bnumber $argv[1]
  set -l cnumber $argv[2]
  set -l vnumber $argv[3]
  set bible_get__r (curl "http://localhost:3055/fish/$bnumber/$cnumber/$vnumber" 2> /dev/null)
  return $status # not really needed, but added anyway to make clear.
end

function __jesaja_greeting -d "Display the current verse as greeting"
  echo
  jesaja_last
  echo
end
