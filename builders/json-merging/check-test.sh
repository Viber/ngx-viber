#!/usr/bin/env bash

cd test-samples
for i in $(find * -maxdepth 0 -type d)
    do
        cd ${i}
        for j in $(ls)
            do
                diff ${j} ../../../../src/assets/json-merging-builder-test/target/${i}/${j}
        done
        cd ..
done
