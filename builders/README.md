#Builders

[Json combine](#json-combine)

[Json validator](#json-validator)

#### Installation
```bash
npm install --save-dev @viberlab/builders
```

## Json combine
### Json files combine builder

#### Options

  * targetPath (string) - path to the target directory (created, if not exists)
   
  * targetFilename (string, default: merged-json.json) - filename of the target file. Ignored, if 'groupByName' is true
  
  * targetFilenameTemplate (string, default: merged-json.json) - template for the target merged json files, $n (e.g. $1, $2) is used for replacements
  
  * sourceList (array) - list of source files and directories. The item is string or object {source: string, filter: string}
  
  * filenameTemplate (regexp, optional) - filename template. For files that match this template only
  
  * groupByFilename (boolean, default: true) - merges json files with the same name
  
  * deepSearch (boolean, default: true) - processes nested directories recursively

#### Example (angular.json)

      "projects": {
        "project-name": {
          ...
          "architect": {
            "build": {
                ...
            },
            "serve": {
                ...
            },
            ...
            "json-combine": {
              "builder": "@viberlab/builders:json-combine",
              "options": {
                "targetPath": "path/to/the/target",
                "targetFilename": "mergedjsons.json",
                "targetFilenameTemplate": "lalala-$1-bebebe-$2-kokoko.json"
                "filenameTemplate": "-en",
                "groupByFilename": true,   
                "deepSearch": true,     
                "sourceList": [
                  "first/source/directory",
                  {
                    source: "second/source/directory",
                    filter: "^locale-([a-z]{2}(-[A-Z]{2})?)\.json$"
                  }
                  "some/file.json"
                ]
              }
            }
          }
        },
        ...
      }


## Json validator
### Json files validator builder

#### Options

  * checkList (array) - list of source files and directories
  
  * dryRun (boolean, default: false) - checks files only (without BOM removing)

#### Example (angular.json)

      "projects": {
        "project-name": {
          ...
          "architect": {
            "build": {
                ...
            },
            "serve": {
                ...
            },
            ...
            "json-merging": {
              "builder": "@viberlab/builders:json-validator",
              "options": {
                "dryRun": false,
                "checkList": [
                  "first/source/directory",
                  "some/file.json"
                ]
              }
            }
          }
        },
        ...
      }

#### Tests

```bash
tsc --build tsconfig.spec.json

jasmine-node --verbose ../dist/test/test/json-combine.spec.js

jasmine-node --verbose ../dist/test/test/json-validator.spec.js
```
