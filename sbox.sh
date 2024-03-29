#!/bin/bash

if ! docker build -t sbox -f Dockerfile.sbox .
then
	echo "Build failed."
	exit 1;
fi

docker run -v "$HOME/.gitconfig:/home/user/.gitconfig" -v "$HOME/.ssh:/home/user/.ssh" -v "$HOME/.gnupg:/home/user/.gnupg" -v "$(pwd):/repo" --rm -it sbox bash -i

