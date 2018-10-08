#!/bin/bash

if [ -n "$1" ]
then
    ng build --prod $1
    cp ./.npmrc dist/$1/
    cd dist/$1
    npm pack
else
    echo -e "\e[91m\e[1mError: It needs parameter - module name (e.g. build.sh ???)"
    cd projects
    for i in $(ls -d */); do echo ${i%%/}; done
fi
