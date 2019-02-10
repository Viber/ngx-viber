#Builders

[Json combine](#json-combine)

[Json validator](#json-validator)

## Json combine
### Json files combine builder

#### Installation
```bash
npm install --save-dev @viberlabs/json-combine-builder
```

#### Options

  * targetPath (string) - path to the target directory (created, if not exists)
   
  * targetFilename (string, default: merged-json.json) - filename of the target file. Ignored, if 'groupByName' is true
  
  * targetFilenameTemplate (string, default: merged-json.json) - template for the target merged json files, $n (e.g. $1, $2) is used for replacements
  
  * sourceList (array) - list of source files and directories. The item is string or object {source: string, filter: string}
  
  * fileTemplate (regexp, optional) - filename template. For files that match this template only
  
  * groupByName (boolean, default: true) - merges json files with the same name
  
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
            "json-merging": {
              "builder": "@viberlab/json-combine-builder:builder",
              "options": {
                "targetPath": "path/to/the/target",
                "targetFilename": "mergedjsons.json",
                "targetFilenameTemplate": "lalala-$1-bebebe-$2-kokoko.json"
                "fileTemplate": "-en",
                "groupByName": true,   
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

#### Installation
```bash
npm install --save-dev @viberlabs/json-validator-builder
```

#### Options

  * checkList (array) - list of source files and directories
  
  * removeBOM (boolean, default: true) - removes BOM from files

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
              "builder": "@viberlab/json-validator-builder:builder",
              "options": {
                "removeBOM": false,
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

