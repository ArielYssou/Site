#!bin/bash/

# Directories
uncommitted='./uncommitted'
templates='./templates'

# Trap for <Ctrl+C> for cleaning
trap ctrl_c INT

# Temporary files
declare -a TEMP_FILES

function ctrl_c() {
	echo -e "\e[93m --- Trapped CTRL-C ---\e[0m"
	printf "\e[0m"
	for file in "${TEMP_FILES[@]}"; do
		if [[ -f $file ]]; then rm $file; fi
	done
	echo -e "\e[92mCleaned everything\e[0m"
	exit 0
}

function update_targets () {
	# Updates all lines within a html file with
	# the <!--TARGET--> flag INPLACE
	file_name="$1"
	origin="$(realpath "$2")"

	for target in $(cat "$file_name" | grep TARGET | tr ' ' '\n' | grep -E 'href|src'); do
		target="$(echo "$target" | sed 's/href=//' | sed 's/src=//' | tr -d '"' | tr -d '>')"

		new_target="$( (cd $(dirname $file_name) && realpath --relative-to=$origin $target) )"
		echo "$new_target"

		sed -i "s|\"$target\"|\"$new_target\"|g" "$file_name"
	done

	return 0
}

function new_post() {
	# Queues a new post, which is stored in the
	# unreleased posts folder until commited
	name_tag="$1"
	dir="$uncommitted/$name_tag/"
	mkdir "$dir"

	if [[ -n ${@:2} ]]; then
		title_tag="${@:2}"
	else
		title_tag="TITLE_TAG"
	fi

	tmp="$templates/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]=$tmp
	cp "$templates/index.html" "$tmp"
	sed -i "s/NAME_TAG/$name_tag/g" "$tmp"
	sed -i "s/TITLE_TAG/$title_tag/g" "$tmp"
	update_targets "$tmp" "$dir"
	mv "$tmp" "$dir/index.html"

	tmp="$templates/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]=$tmp
	cp "$templates/sketch.js" "$tmp"
	sed -i "s/NAME_TAG/$name_tag/g" "$tmp"
	sed -i "s/TITLE_TAG/$title_tag/g" "$tmp"
	mv "$tmp" "$dir/sketch.js"

	return 0
}

function publish_main() {
	# Publishes an uncommited post

	origin="$uncommitted/$1"
	if [[ ! -d "$origin" ]]; then
		echo "\e[31mPost could not be found. Current uncommited posts:\e[0m"
		ls "$uncommitted"
		return 1
	fi

	case $2 in
		phys|p)
			destiny="physics"
			;;
		code|c)
			destiny="coding"
			;;
		ml)
			destiny="machine_learning"
			;;
		*)
			destiny="misc"
			;;
	esac

	destiny+="/$1"

	# Post to main
	tmp="$origin/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]="$tmp"

	title="$(cat $origin/index.html | grep -A 1 blog_title | tail -n1 | tr -d '\t')"

	cp "$templates/main_post.html" "$tmp"
	sed -i "s|TARGET_TAG|./blog/$destiny|g" "$tmp"
	sed -i "s/TITLE_TAG/$title/g" "$tmp"

	ident="$(cat "test.html" | grep MAIN_TOP | sed 's/[^\t]//g')"
	while read -r line; do
		s="$(cat "$tmp" | grep "$line" | head -n1)"
		echo "$s"
		sed -i "/MAIN_TOP/a INPUT_LINE" './test.html'
		sed -i "s|INPUT_LINE|$ident$s|g" './test.html'
	done <<< $(tac $tmp)
	rm $tmp

	# Post to blog
	tmp="$origin/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]="$tmp"

	cp "$templates/blog_post.html" "$tmp"
	sed -i "s|TARGET_TAG|./$destiny|g" "$tmp"
	sed -i "s/TITLE_TAG/$title/g" "$tmp"
	sed -i "s|DATE_TAG|$(date +%c)|g" "$tmp"

	ident="$(cat "test.html" | grep MAIN_TOP | sed 's/[^\t]//g')"
	while read -r line; do
		s="$(cat "$tmp" | grep "$line" | head -n1)"
		echo "$s"
		sed -i "/MAIN_TOP/a INPUT_LINE" './test.html'
		sed -i "s|INPUT_LINE|$ident$s|g" './test.html'
	done <<< $(tac $tmp)
	rm $tmp

	# Move index.html
	tmp="$origin/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]=$tmp
	cp "$origin/index.html" "$tmp"
	update_targets "$tmp" "./blog/$destiny"
	#mv $tmp
	#rm $tmp

	# Move sketch.js
	cp "$origin/sketch.js" "./blog/$destiny"
	#mv $tmp

	return 0
}

function upload() {
	# Updates all new and folders

	rsync -au "./" ariel@fig.if.usp.br:~/www/html/

	return 0
}

function search() {
	# Search all files for given strings

	for arg in $@; do
		for file in $(find . -maxdepth 5 -type f); do
			if [[ -n $(cat $file | grep -w $arg) ]]; then
				echo "-------------------"
				echo -e "\e[33m$file\e[0m"
				echo "-------------------"
				cat $file | grep -nw $arg | tr -d '\t'
			fi
		done
	done
	return 0
}

case $1 in
	-n|--new)
		new_post "$2"
		exit $?
		;;
	-u|--upload)
		upload
		exit $?
		;;
	-s|--search)
		search ${@:2}
		exit $?
		;;
	-pm|--main)
		publish_main ${@:2}
		exit $?
		;;
esac
