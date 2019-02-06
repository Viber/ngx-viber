#!/usr/bin/env bash

declare -A tests0=(
    [description]='removeBOM = false'
    [test]='--removeBOM=false'
)

declare -A tests1=(
    [description]='removeBOM = true'
    [test]='--removeBOM=true'
)

printf '\xEF\xBB\xBF{"bom1": 1,"bom2": true,"bom3": "there is BOM"}' > ../../src/assets/json-merging-builder-test/source/bom.json

declare -n test
i=0
for test in ${!tests@}
    do
        ((i++))
        echo -e "\e[92mTest ${i}: ${test[description]}"
        ng run libs:json-checking ${test[test]}
        echo "Error: $?"
done
