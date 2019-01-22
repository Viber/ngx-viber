## Json files merging builder

#### Options

  * targetPath (string) - path to the target directory
   
  * targetFilename (string, default: merged-json.json) - filename of the target file. Ignored, if 'groupByName' is true
  
  * sourceList (string[]) - list of source files and directories
  
  * fileTemplate (regexp, optional) - filename template. For files that match this template only
  
  * groupByName (boolean, default: false) - merge json files with the same name
  
  * nestedDirectories (boolean, default: false) - processes nested directories recursively

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
              "builder": "json-merging-builder:file",
              "options": {
                "targetPath": "path/to/the/target",
                "targetFilename": "mergedjsons.json",
                "fileTemplate": "-en",
                "groupByName": true,   
                "nestedDirectories": true,     
                "sourceList": [
                  "first/source/directory",
                  "second/source/directory",
                  "some/file.json"
                ]
              }
            }
          }
        },
        ...
      }

