#!/bin/sh
docker stop $(docker ps -aq) --time 1