#!bin/bash/

# Directories
uncommitted='./uncommitted'
templates='./templates'

# Relvant html
home_html='./index.html'
blog_html='./blog/index.html'

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

function help() {
	clear
	cat << EOF

				control.sh 

Description:
	control.sh: A script to organizer and automatize all site activities.

Synopsys
	control.sh [-h] [-n <post name>] [-s <string>] [-u] [-p <post name>] 

Options
	-h|--help		Shows help text
	-n|--new	Makes a new post. It wll be only a sketch untill you publish it
	-s|--search Search a given string in all files
	-p|--publish Publishes a uncommited post
	-u|--upload Uploads new files to www server. It also updates all files that where edited

Details
	For futher details plase refer to the source code, for it's (hopefully) well documented.

Authors
	Ariel Yssou arielyssou@gmail.com

Bugs
	No bugs are know up to this date, which probably means that I haven't properly debuged this so if you find any please contact me.
EOF
}

function update_targets () {
	# Updates all lines within a html file with
	# the <!--TARGET--> flag INPLACE
	file_name="$1"

	local origin
	origin="$(realpath "$2")"

	for target in $(cat "$file_name" | grep TARGET | tr ' ' '\n' | grep -E 'href|src'); do
		target="$(echo "$target" | sed 's/href=//' | sed 's/src=//' | tr -d '"' | tr -d '>')"

		new_target="$( (cd $(dirname $file_name) && realpath --relative-to=$origin $target) )"

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

function publish() {
	# Publishes an uncommited post

	local origin destiny

	origin="./uncommitted/$1"
	if [[ ! -d "$origin" ]]; then
		echo "\e[31mPost could not be found. Current uncomitted posts:\e[0m"
		ls "$uncommitted"
		return 0
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
	if [[ -d "./blog/$destiny" ]]; then
		echo -e "\e[33mPost was already posted, aborting.\e[0m"
		return 0
	else
		mkdir "./blog/$destiny"
	fi

	# Move index.html
	tmp="$origin/.temp"
	cp "$origin/index.html" "$tmp"
	update_targets "$tmp" "./blog/$destiny"
	mv "$tmp" "./blog/$destiny/index.html"

	# Move relevant files
	cp "$origin/sketch.js" "./blog/$destiny"
	if [[ ! -f"$origin/main_image.png"   ]]; then
		echo -e "Warning, missing main image \e[93;4mmain_image.png\e0m"
	else
		cp "$origin/main_image.png" "./blog/$destiny"
	fi
	for file in $(find $origin/ -maxdepth 1 -mindepth 1 -type f); do
		if [[ ! $(echo $file | grep "_temp_") ]]; then
			cp "$file" "./blog/$destiny"
		fi
	done


	# Post to home
	tmp="$origin/.temp" #Temporary file to write post html to be included
											#in the home index.html file
	TEMP_FILES[${#TEMP_FILES[@]}]="$tmp" #To be cleaned if ctrl+c

	title="$(cat $origin/index.html | grep -A 1 blog_title | tail -n1 | tr -d '\t')"
	t_stamp="$(date +%s)"
	cp "index.html" "./backup/home_$t_stamp.html"

	cp "$templates/home_post.html" "$tmp"
	sed -i "s|TARGET_TAG|./blog/$destiny|g" "$tmp"
	sed -i "s/TITLE_TAG/$title/g" "$tmp"
	
	ident="$(cat "$home_html" | grep CURRENT_COL_TAG | sed 's/[^\t]//g')"

	echo -e "$(tac $tmp)" > $tmp
	while IFS='' read line; do
		sed -i "/CURRENT_COL_TAG/a INPUT_LINE" "$home_html"
		sed -i "s|INPUT_LINE|$ident$line|g" "$home_html"
	done < $tmp
	rm $tmp

	if [[ -n $(cat "$home_html" | grep 'CURRENT_COL_TAG' | grep '1') ]]; then
		sed -i "s/COL1 CURRENT_COL_TAG/COL1/" "$home_html"
		sed -i "s/COL2/COL2 CURRENT_COL_TAG/" "$home_html"
	else
		sed -i "s/COL2 CURRENT_COL_TAG/COL2/" "$home_html"
		sed -i "s/COL1/COL1 CURRENT_COL_TAG/" "$home_html"
	fi

	# Post to blog
	tmp="$origin/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]="$tmp"

	cp "index.html" "./backup/blog_$t_stamp.html"

	cp "$templates/blog_post.html" "$tmp"
	sed -i "s|TARGET_TAG|./$destiny|g" "$tmp"
	sed -i "s/TITLE_TAG/$title/g" "$tmp"
	sed -i "s|DATE_TAG|$(date +%c)|g" "$tmp"

	ident="$(cat "$blog_html" | grep BLOG_TOP | sed 's/[^\t]//g')"
	echo -e "$(tac $tmp)" > $tmp
	while IFS='' read  line; do
		sed -i "/BLOG_TOP/a INPUT_LINE" "$blog_html"
		sed -i "s|INPUT_LINE|$ident$line|g" "$blog_html"
	done < $tmp
	rm $tmp



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
	-p|--publish)
		publish ${@:2}
		exit $?
		;;
esac
