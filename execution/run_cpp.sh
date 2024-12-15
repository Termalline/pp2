#!/bin/sh
set -e
g++ -Wall -g -o code output.cpp 
./code < stdin.txt 
rm -f code