#!/bin/bash
# Where 
#   - $1 = file input
#   - $2 = file output

awk '{sub(/^./,tolower(substr($0,1,1)),$0);print}' "$1" > "$2"