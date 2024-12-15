#!/bin/sh
set -e
gcc -Wall -g -std=gnu99 -o code output.c 
./code < stdin.txt 
rm -f code