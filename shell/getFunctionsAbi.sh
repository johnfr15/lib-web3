#!/bin/bash

if [[ $# -eq 1 ]]; then
  cat "$1" | grep -w name | cut -d " " -f 8 | tr -d "\n\"" | sed "s/,/\n/g"
else
  echo "Usage: ./getFunctionAbi.sh yourAbiFile.json"
fi
