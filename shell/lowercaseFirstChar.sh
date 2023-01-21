#!/bin/bash

find . -type f -exec bash -c 'mv "$1" "$(dirname "$1")/$(echo $(basename "$1") | tr "[:upper:]" "[:lower:]" | cut -c 1-1)$(echo $(basename "$1") | cut -c 2-)"' - {} \;