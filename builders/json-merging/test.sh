#!/usr/bin/env bash

declare -A tests0=(
    [description]='groupByName = false, nestedDirectories = false'
    [test]='--groupByName=false --nestedDirectories=false'
)

declare -A tests1=(
    [description]='groupByName = true, nestedDirectories = false'
    [test]='--groupByName=true --nestedDirectories=false'
)

declare -A tests2=(
    [description]='groupByName = false, nestedDirectories = true'
    [test]='--groupByName=false --nestedDirectories=true'
)

declare -A tests3=(
    [description]='groupByName = true, nestedDirectories = true'
    [test]='--groupByName=true --nestedDirectories=true'
)

declare -A tests4=(
    [description]='targetFilename is set'
    [test]='--targetFilename=other-merged-json.json'
)

declare -n test
i=0
for test in ${!tests@}
    do
        ((i++))
        mkdir -p ././../../src/assets/json-merging-builder-test/target/${i}
        echo -e "\e[92mTest ${i}: ${test[description]}"
        ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/${i} ${test[test]}
done