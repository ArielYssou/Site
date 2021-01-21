#!bin/bash/

# Directories
uncommitted='./uncommitted'
templates='./templates'

# Relevant html
home_index='./index.html'
blog_index='./blog/index.html'

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
	# Updates all lines within a file with the TARGET flag *INPLACE*
	# e.g.: currently a path points to ../../Desktop and the file will be moved to a folder ./some/folder/
	#		thus the original path must include the new added depth and be updated to ../../../../Desktop.
	#
	# Input:
	# 	-file_name: string with the name of the file
	# 	-destiny: Folder to where the file will be moved
	file_name="$1"

	local _destiny
	_destiny="$(realpath "$2")"

	# Find the line number of all lines with target
	for line_no in $(cat $file_name | grep -n "TARGET" | cut -f1 | tr -d ':'); do
		line="$(sed "$line_no""q;d" $file_name)"

		# Isolate the target path
		target=$(echo $line |
			tr ' ' '\n' |
			grep -E 'href|src' |
			sed 's/href=//' | sed 's/src=//' |
			tr -d '"' | tr -d '>')

		#echo "$(echo $target | tr -d ' ')"

		# Get the relative path. The relative path in determined many times for the same target. This
		# suboptimal solution is acceptable beacause there are only ~10 lines to be updated.
		new_target="$( (cd $(dirname $file_name) && realpath --relative-to=$_destiny $target) )"
		#echo  -e "\e[92m$(echo $new_target | tr -d ' ')\e[0m"
		target="$(echo "$target" | sed "s/\./\\\./g")" # Avoid expanding . in sed
		new_target="$(echo "$new_target" | sed "s/\./\\\./g")"
		echo 

		sed -i "$line_no""s|$target|$new_target|g" "$file_name"
		#echo  -e "\e[94m$(cat $file_name | grep "\"$new_target\"" | tr -d ' ' | tr -d "\t")\e[0m"
	done

	return 0
}

function new_post() {
	# Queues a new post, which is stored in the unreleased posts folder until commited
	# Uses the deafult templates for a new post.
	# INPUT
	#		name_tag: name acronim that will be used to identify this post
	#		title_tag: title tag
	
	# flag checker
	declare -a FLAGS
	declare -a ARGS
	ARGS=("$@")

	for arg in ${ARGS[@]}; do
		if [[ $arg == "-f" ]]; then
			ARGS=("${ARGS[@]/"-f"}") # remove flag from imput
			FLAGS[${#FLAGS[@]}]="-f" 
		fi
	done

	#input parser
	name_tag="$1"
	dir="$uncommitted/$name_tag/"
	if [[ -f $1 ]]; then
		if ! [[ "${FLAGS[@]}" =~ "-f" ]]; then  # Force flag
			mkdir "$dir"
		else
			printf "Post already exists. Aborting.\n"
			return 0
		fi
	fi

	if [[ -n ${@:2} ]]; then
		title_tag="${@:2}"
	else
		title_tag="TITLE_TAG"
	fi

	# Changing name and title tags in the index file
	tmp="$templates/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]=$tmp
	cp "$templates/index.html" "$tmp"
	sed -i "s/NAME_TAG/$name_tag/g" "$tmp"
	sed -i "s/TITLE_TAG/$title_tag/g" "$tmp"
	update_targets "$tmp" "$dir"
	mv "$tmp" "$dir/index.html"

	# Changing name and title tags in the skectch file
	tmp="$templates/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]=$tmp
	cp "$templates/sketch.js" "$tmp"
	sed -i "s/NAME_TAG/$name_tag/g" "$tmp"
	sed -i "s/TITLE_TAG/$title_tag/g" "$tmp"
	mv "$tmp" "$dir/sketch.js"

	unset FLAGS
	unset ARGS

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
	
	ident="$(cat "$home_index" | grep CURRENT_COL_TAG | sed 's/[^\t]//g')"

	echo -e "$(tac $tmp)" > $tmp
	while IFS='' read line; do
		sed -i "/CURRENT_COL_TAG/a INPUT_LINE" "$home_index"
		sed -i "s|INPUT_LINE|$ident$line|g" "$home_index"
	done < $tmp
	rm $tmp

	if [[ -n $(cat "$home_index" | grep 'CURRENT_COL_TAG' | grep '1') ]]; then
		sed -i "s/COL1 CURRENT_COL_TAG/COL1/" "$home_index"
		sed -i "s/COL2/COL2 CURRENT_COL_TAG/" "$home_index"
	else
		sed -i "s/COL2 CURRENT_COL_TAG/COL2/" "$home_index"
		sed -i "s/COL1/COL1 CURRENT_COL_TAG/" "$home_index"
	fi

	# Post to blog
	tmp="$origin/.temp"
	TEMP_FILES[${#TEMP_FILES[@]}]="$tmp"

	cp "index.html" "./backup/blog_$t_stamp.html"

	cp "$templates/blog_post.html" "$tmp"
	sed -i "s|TARGET_TAG|./$destiny|g" "$tmp"
	sed -i "s/TITLE_TAG/$title/g" "$tmp"
	sed -i "s|DATE_TAG|$(date +%c)|g" "$tmp"

	ident="$(cat "$blog_index" | grep BLOG_TOP | sed 's/[^\t]//g')"
	echo -e "$(tac $tmp)" > $tmp
	while IFS='' read  line; do
		sed -i "/BLOG_TOP/a INPUT_LINE" "$blog_index"
		sed -i "s|INPUT_LINE|$ident$line|g" "$blog_index"
	done < $tmp
	rm $tmp

	return 0
}

function upload() {
	# Updates all new and folders deprecated
	# (DEPRECATED) rsync -au "./" ariel@fig.if.usp.br:~/www/html/
	git add *
	git commit -m $1
	git push

	return $?
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

function render() {
	# Render a html using the available templetes. The following renderings are made:
	# - Includes the html of any notebook
	# - Uses pygments on all <pre> cels
	# - Parses the sketch.js file with pygments and include code
	
#	basedir="$(dirname $(realpath $1))"
#	echo $(cat $1 | grep \{\%\ include | tr -d '\t' | cut -d' ' -f3 | tr -d \')
#	for file_inclusion in $(cat $1 | grep \{\%\ include | tr -d '\t' | cut -d' ' -f3 | tr -d \'); do
#		file_inclusion="$basedir/$file_inclusion"
#		if [[ $file_inclusion == *".ipynb" ]]; then
#			jupyter nbconvert --to html --template basic $file_inclusion
#		elif [[ ! ($file_inclusion == *".html") ]]; then
#			name="$(basename $file_inclusion | cut -d'.' -f1 )"
#			pygmentize -f html -O linenos=1 $file_inclusion > "$basedir/$name.html"
#		else
#			continue
#		fi
#	done

	python render.py $1

	return 0
}

function	tester() {
	local _main_index="./index_test.html"
	local _blog_index="./blog/index_test.html"

	TEMP_FILES[${#TEMP_FILES[@]}]=$_main_index
	TEMP_FILES[${#TEMP_FILES[@]}]=$_blog_index

	cp $home_index $_main_index
	cp $blog_index $_blog_index
	
	echo -e "Testing post contructor"
	new_post "test_post" "test" "-f"
	# TESTS IN NEW POST

	# make new dummy post
	# dummy text into it
	# publish to each folder
	# 	test broken links
	# visualy analise alterations to main index file

	echo -e "Creating a dummy post"
}

case $1 in
	-n|--new)
		new_post "$2"
		exit $?
		;;
	-h|--help)
		help
		exit 0
		;;
	-u|--upload)
		upload
		exit $?
		;;
	-s|--search)
		search ${@:2}
		exit $?
		;;
	-r|--render)
		render ${@:2}
		exit $?
		;;
	-p|--publish)
		publish ${@:2}
		exit $?
		;;
esac
