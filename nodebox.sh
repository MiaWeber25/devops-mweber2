#!/bin/bash

if ! docker build -t nodebox -f Dockerfile.nodebox .
then
	echo "Build failed."
	exit 1;
fi

docker run -v "$HOME/.gitconfig:/home/node/.gitconfig" -v "$HOME/.ssh:/home/node/.ssh" -v "$HOME/.gnupg:/home/node/.gnupg" -v "$(pwd):/repo" -p 3000:3000 --rm -it nodebox bash -i

