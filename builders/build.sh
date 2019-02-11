#!/usr/bin/env bash

tsc

cd src

for dir in $(ls -d */); do
    cp "$dir"schema.json "$dir"schema.d.ts ../dist/"$dir";
done

cd ..

cp builders.json README.md package.json dist
cd dist

npm pack
