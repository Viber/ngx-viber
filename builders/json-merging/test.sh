#!/usr/bin/env bash

declare -A tests0=(
    [description]='groupByFilename = false, nestedDirectories = false'
    [test]='--groupByFilename=false --nestedDirectories=false'
)

declare -A tests1=(
    [description]='groupByFilename = true, nestedDirectories = false'
    [test]='--groupByFilename=true --nestedDirectories=false'
)

declare -A tests2=(
    [description]='groupByFilename = false, nestedDirectories = true'
    [test]='--groupByFilename=false --nestedDirectories=true'
)

declare -A tests3=(
    [description]='groupByFilename = true, nestedDirectories = true'
    [test]='--groupByFilename=true --nestedDirectories=true'
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
        mkdir -p ../../src/assets/json-merging-builder-test/target/${i}
        echo -e "\e[92mTest ${i}: ${test[description]}"
        ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/${i} ${test[test]}
        echo "Error: $?"
done
