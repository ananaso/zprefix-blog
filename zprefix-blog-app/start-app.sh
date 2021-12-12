#!/usr/bin/bash
 
rm .env

while IFS= read -r line; do
  if [ ! -z "$line" ] && [[ "$line" != "#"* ]]; then
    echo "REACT_APP_$line" >> .env
  fi
done < ../.env

npm start