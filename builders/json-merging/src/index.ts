import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { bindNodeCallback, EMPTY, forkJoin, from, merge, Observable, of, throwError, } from 'rxjs';
import { filter, map, mapTo, mergeAll, mergeMap, reduce, switchMap, } from 'rxjs/operators';
import { JsonMergingBuilderSchema } from './schema';
import { mkdirSync, readdir, readFile, stat, statSync, writeFile } from 'fs';

export default class JsonMergingBuilder implements Builder<JsonMergingBuilderSchema> {
  private readonly writeFileObservable = bindNodeCallback(writeFile);
  private readonly systemPath: string;
  private template: RegExp;

  constructor(private context: BuilderContext) {
    this.systemPath = getSystemPath(this.context.workspace.root);
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonMergingBuilderSchema>>): Observable<BuildEvent> {
    const {targetPath, targetFilename, sourceList, filenameTemplate, groupByFilename, deepSearch} = builderConfig.options;
    const path = `${this.systemPath}/${targetPath}/`;
    const isSingleFile = !groupByFilename;

    try {
      statSync(path);
    } catch (e) {
      if (e.code === 'ENOENT') {
        mkdirSync(path);
      }
    }

    this.template = new RegExp(filenameTemplate);

    return from(sourceList)
      .pipe(
        // emit file names
        mergeMap(source => this.getFilesFromDir(this.systemPath + '/' + source, deepSearch)),

        // filer unwanted
        filter(filePath => !filenameTemplate || this.filterFiles(filePath)),

        // read file
        mergeMap(filePath => this.getFileContent(filePath)
          .pipe(map(jsonData => ([filePath.split('/').pop(), jsonData])))
        ),
        // merge files
        reduce((acc, data) => {
          const fileName = data[0];
          const jsonData = data[1];

          // Single file case
          if (isSingleFile) {
            return Object.assign(acc, jsonData);
          }

          const sourceData = acc[fileName] || {};
          Object.assign(sourceData, jsonData);
          acc[fileName] = sourceData;
          return acc;
        }, {}),

        // Write to file/s
        switchMap(jsonData => {
          if (isSingleFile) {
            return this.writeFileObservable(path + targetFilename, JSON.stringify(jsonData));
          }
          return this.groupByNameNew(path, jsonData);
        }),

        mapTo({success: true})
      );
  }

  private getFilesFromDir(root: string, isDeepSearch: boolean = true): Observable<string> {
    const stat$ = bindNodeCallback(stat);
    const readdir$ = bindNodeCallback(readdir);

    return stat$(root)
      .pipe(
        map(fileInfo => {
          if (fileInfo.isFile() && root.endsWith('.json')) {
            return of(root);
          }

          if (fileInfo.isDirectory() && isDeepSearch) {
            return readdir$(root)
              .pipe(
                mergeMap((files) => merge(
                  ...files.map((file) => this.getFilesFromDir(root + '/' + file))
                  )
                )
              );
          }
          return EMPTY;
        }),

        mergeAll()
      );
  }

  private groupByNameNew(targetPath: string, jsonData): Observable<Array<void>> {
    return forkJoin(
      Object.keys(jsonData)
        .map(k => this.writeFileObservable(targetPath + k, JSON.stringify(jsonData[k])))
    );
  }

  private getFileContent(filepath: string): Observable<Object> {
    const readFile$ = bindNodeCallback((
      path: string,
      encoding: string,
      callback: (error: Error, buffer: string) => void
    ) => readFile(path, encoding, callback));

    return readFile$(filepath, 'utf8')
      .pipe(
        switchMap((data) => {
          try {
            const parsed = JSON.parse(
              data.replace(/^\uFEFF/, '') // removes BOM
            );

            return of(parsed);

          } catch (e) {
            return throwError('JSON parsing error: ' + filepath);
          }
        })
      );
  }

  private filterFiles(path: string): boolean {
    return this.template.test(path.split('/').pop());
  }
}
