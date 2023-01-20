#!/bin/bash

if [[ $# -eq 1 ]]; then
  cat "$1" | grep -w event
else
  echo "Usage: ./getEventsAbi.sh yourAbiFile.json"
fi
