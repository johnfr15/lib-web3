#!/bin/bash
# Where
#   $1 = Number of charactere to remove for each files found

find . -depth -exec bash -c 'mv "$1" "$(dirname "$1")/$(basename "$1" | cut -c $2-)"' - {} $1 \;