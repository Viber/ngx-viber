## Json files validator builder

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
              "builder": "json-merging-builder:file",
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

