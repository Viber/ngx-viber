#!/usr/bin/env bash

declare -A tests0=(
    [description]='groupByFilename = false, deepSearch = false'
    [test]='--groupByFilename=false --deepSearch=false'
)

declare -A tests1=(
    [description]='groupByFilename = true, deepSearch = false'
    [test]='--groupByFilename=true --deepSearch=false'
)

declare -A tests2=(
    [description]='groupByFilename = false, deepSearch = true'
    [test]='--groupByFilename=false --deepSearch=true'
)

declare -A tests3=(
    [description]='groupByFilename = true, deepSearch = true'
    [test]='--groupByFilename=true --deepSearch=true'
)

declare -A tests4=(
    [description]='targetFilename is set'
    [test]='--targetFilename=other-merged-json.json'
)

declare -A tests5=(
    [description]='filenameTemplate is set, groupByFilename = false'
    [test]='--filenameTemplate=zz --groupByFilename=false'
)

declare -A tests6=(
    [description]='filenameTemplate is set, groupByFilename = true'
    [test]='--filenameTemplate=zz --groupByFilename=true'
)

declare -A tests7=(
    [description]='targetFilenameTemplate is set, groupByFilename = true'
    [test]='--targetFilenameTemplate=bebebe-$1-kokoko --groupByFilename=true'
)

declare -n test
i=0
rm -rf ../../src/assets/json-merging-builder-test/target
for test in ${!tests@}
    do
        ((i++))
        mkdir -p ../../src/assets/json-merging-builder-test/target/${i}
        echo -e "\e[92mTest ${i}: ${test[description]}"
        ng run libs:json-merging --targetPath=src/assets/json-merging-builder-test/target/${i} ${test[test]}
        echo "Error: $?"
done
