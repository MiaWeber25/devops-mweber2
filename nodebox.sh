#!/bin/bash

if ! docker build -t nodebox -f Dockerfile.nodebox .
then
	echo "Build failed."
	exit 1;
fi

docker run -v "$HOME/.gitconfig:/home/user/.gitconfig" -v "$HOME/.ssh:/home/user/.ssh" -v "$HOME/.gnupg:/home/user/.gnupg" -v "$(pwd):/repo" --rm -it nodebox bash -i

