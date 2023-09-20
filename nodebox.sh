#!/bin/bash

if ! docker build -t nodebox -f Dockerfile.nodebox .
then
	echo "Build failed."
	exit 1;
fi

docker run -v "$HOME/.gitconfig:/root/.gitconfig" -v "$HOME/.ssh:/root/.ssh" -v "$HOME/.gnupg:/root/.gnupg" -v "$(pwd):/repo" --rm -it nodebox bash -i

