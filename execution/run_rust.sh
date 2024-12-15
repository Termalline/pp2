#!/bin/sh
set -e
rustc output.rs
./output < stdin.txt 
rm -f output