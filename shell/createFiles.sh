#!/bin/bash
# Where 
#   - $1 = file input

while read line; do touch "$line"; done < $1
