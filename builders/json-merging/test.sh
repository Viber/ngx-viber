#!/usr/bin/env bash

echo -e '\e[92mTest 1: groupByName = false, nestedDirectories = false'
ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/1 --groupByName=false --nestedDirectories=false

echo -e '\e[92mTest 2: groupByName = true, nestedDirectories = false'
ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/2 --groupByName=true --nestedDirectories=false

echo -e '\e[92mTest 3: groupByName = false, nestedDirectories = true'
ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/3 --groupByName=false --nestedDirectories=true

echo -e '\e[92mTest 4: groupByName = true, nestedDirectories = true'
ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/4 --groupByName=true --nestedDirectories=true
