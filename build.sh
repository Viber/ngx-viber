#!/bin/bash

if [ -n "$1" ]
then
    ng test $1 --browsers=ChromeHeadless --watch=false --progress=false --codeCoverage=true

    ng build --prod $1

    if [ -d "./projects/$1/assets" ]; then
      # Control will enter here if $DIRECTORY exists.
      cp -R ./projects/$1/assets ./dist/$1/assets
    fi

    if [ -d "./projects/$1/scss" ]; then
      # Control will enter here if $DIRECTORY exists.
      cp -R ./projects/$1/scss ./dist/$1/scss
    fi

    cp ./.npmrc dist/$1/
    cd dist/$1
    npm pack
else
    echo -e "\e[91m\e[1mError: It needs parameter - module name (e.g. build.sh ???)"
    cd projects
    for i in $(ls -d */); do echo ${i%%/}; done
fi
