#!/bin/bash

re='^-?[0-9]+([.][0-9]+)?$'

if (( $1 )) || (( $2 )) && (( $2 < $1 )); then
	echo ">:C"
	exit 1
fi

completed="$1"
total="$2"
if ! (( $3 )); then color=2; else color="$3"; fi
if ! (( $4 )); then bar_size=30; else bar_size=$4; fi

if (( $(tput cols) - bar_size - 16 <= 0 )); then
	# 30 is the default size of the bar and 16 is a sensible
	# value to a progress print; "Progress: <bar> 000%". Just
	# a guess so we can resize the bar so it fits the screen.
	# This loop ajust the size of the bar to the terminal size.
	let bar_size=$(tput cols)-16 
	if (( bar_size < 0 )); then bar_size=0; fi
fi

percentage="$(printf "%.0f" $( echo '('$completed'/'$total')*'100 | bc -l | tr '.' ','))"
bar_hilight="$(printf "%.0f" $( echo '('$percentage'/'100')*'$bar_size | bc -l | tr '.' ','))"
let bar_darkened=bar_size-bar_hilight
# DEBUG echo "compl: $completed tot:  $total perc: $percentage hil: $bar_hilight dark: $bar_darkened"
echo

for i in $(seq 1 $bar_hilight); do
	printf "\e[%sm \e[0m" "48;5;$color"
done
for i in $(seq 1 $bar_darkened); do
	printf "\e[40m \e[0m"
done
printf "\e[%sm    $percentage%%\e[0m" "38;5;$color"
echo

exit 0
