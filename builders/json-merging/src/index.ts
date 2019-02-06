import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { bindNodeCallback, EMPTY, forkJoin, from, merge, Observable, of, throwError, } from 'rxjs';
import { filter, map, mapTo, mergeAll, mergeMap, reduce, switchMap, } from 'rxjs/operators';
import { JsonMergingBuilderSchema, JsonSource } from './schema';
import { mkdirSync, readdir, readFile, stat, statSync, writeFile } from 'fs';

export default class JsonMergingBuilder implements Builder<JsonMergingBuilderSchema> {
  private readonly writeFileObservable = bindNodeCallback(writeFile);
  private readonly systemPath: string;
  private template: RegExp;
  private targetTemplate: string;


  constructor(private context: BuilderContext) {
    this.systemPath = getSystemPath(this.context.workspace.root);
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonMergingBuilderSchema>>): Observable<BuildEvent> {
    const {
      targetPath,
      targetFilename,
      sourceList,
      filenameTemplate,
      targetFilenameTemplate,
      groupByFilename,
      deepSearch
    } = builderConfig.options;
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
    this.targetTemplate = targetFilenameTemplate;

    return from(<Array<string | JsonSource>>sourceList)
      .pipe(
        map((source: string | JsonSource) => typeof source === 'string' ? {source: source, filter: ''} : source),
        // emit file names
        mergeMap((source: JsonSource) =>
          this.getFilesFromDir(this.systemPath + '/' + source.source, new RegExp(source.filter), deepSearch)),

        // filer unwanted
        filter(filePath => !filenameTemplate || this.filterFiles(filePath[0])),

        // read file
        mergeMap(filePath => this.getFileContent(filePath[0])
          .pipe(map(jsonData => ([this.changeFilename(filePath[0].split('/').pop(), filePath[1]), jsonData])))
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

  private getFilesFromDir(root: string, filterTemplate: RegExp, isDeepSearch: boolean = true): Observable<Array<string>> {
    const stat$ = bindNodeCallback(stat);
    const readdir$ = bindNodeCallback(readdir);

    return stat$(root)
      .pipe(
        map(fileInfo => {
          if (fileInfo.isFile() && root.endsWith('.json') && filterTemplate.test(root.split('/').pop())) {
            return of([root, filterTemplate.source]);
          }

          if (fileInfo.isDirectory() && isDeepSearch) {
            return readdir$(root)
              .pipe(
                mergeMap((files) => merge(
                  ...files.map((file) => this.getFilesFromDir(root + '/' + file, filterTemplate))
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

  private changeFilename(filename: string, template: string): string {
    if ('(?:)' === template) {
      return filename;
    }
    return filename.match(new RegExp(template)).slice(1).reduce((acc, cur, i) => acc.replace('$' + (i + 1), cur), this.targetTemplate);
  }
}
