import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { bindNodeCallback, EMPTY, forkJoin, from, merge, Observable, of, throwError, } from 'rxjs';
import { catchError, filter, map, mapTo, mergeAll, mergeMap, reduce, switchMap, tap, } from 'rxjs/operators';
import { JsonCombineBuilderSchema, JsonSource } from './schema';
import { mkdir, readdir, readFile, stat, writeFile } from 'fs';
import { Stats } from '@angular-devkit/core/src/virtual-fs/host';


const extractFileName = (filePath: string): string => {
  return filePath.split('/').pop();
};

const parseStringToJson = switchMap((data: string) => {
  try {
    return of(JSON.parse(
      data.replace(/^\uFEFF/, '') // removes BOM
    ) as Object);
  } catch (e) {
    return throwError(e);
  }
});

export default class JsonCombineBuilder implements Builder<JsonCombineBuilderSchema> {
  private readonly systemPath: string;
  private targetTemplate: string;
  private template: RegExp;

  constructor(protected context: BuilderContext) {
    this.systemPath = getSystemPath(this.context.workspace.root);
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonCombineBuilderSchema>>): Observable<BuildEvent<any>> {
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

    this.template = new RegExp(filenameTemplate);
    this.targetTemplate = targetFilenameTemplate;
    const success: BuildEvent = {success: true};

    return from(<Array<string | JsonSource>>sourceList)
      .pipe(
        map((source: string | JsonSource) => typeof source === 'string' ? {source: source, filter: ''} : source),

        // emit file names
        mergeMap((source: JsonSource) =>
          this.getFilesListFromDirectory(this.systemPath + '/' + source.source, new RegExp(source.filter), deepSearch)
        ),

        // filer unwanted
        filter(file => !filenameTemplate || this.filterFiles(file.path)),

        // read file
        mergeMap(filePath => this.getFileContent(filePath.path)
          .pipe(
            parseStringToJson,
            catchError(e => {
              return throwError('JSON parsing error: ' + filePath.path);
            }),
            map(jsonData => {
              const changedFileName: string = this.changeFilename(extractFileName(filePath.path), filePath.filter);
              return {fileName: changedFileName, jsonData: jsonData};
            })
          )
        ),
        // merge files
        reduce<{ fileName: string, jsonData: Object }, { [name: string]: Object }>((acc, {fileName, jsonData}) => {
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
        // Create directory
        tap(() => this.createDirectoryIfNotExists(path)),
        switchMap(jsonData => this.writeFilesToDirectory(path, isSingleFile ? {[targetFilename]: jsonData} : jsonData)),
        mapTo(success)
      );
  }

  /**
   * Get list of files from provided "root" directory, according to "filterTemplate"
   * "isDeepSearch" will search in nested directories as well.
   *
   * Returns Observable of Array with paths to found files
   *
   * @param root
   * @param filterTemplate
   * @param isDeepSearch
   */
  private getFilesListFromDirectory(
    root: string,
    filterTemplate: RegExp,
    isDeepSearch: boolean = true
  ): Observable<{ path: string, filter: string }> {
    const stat$ = bindNodeCallback(stat);
    const readdir$ = bindNodeCallback(readdir);

    return stat$(root)
      .pipe(
        map(fileInfo => {
          if (fileInfo.isFile() && root.endsWith('.json') && filterTemplate.test(extractFileName(root))) {
            return of({path: root, filter: filterTemplate.source});
          }

          if (fileInfo.isDirectory() && isDeepSearch) {
            return readdir$(root)
              .pipe(
                mergeMap((files: Array<string>) => merge(
                  ...files.map((file) => this.getFilesListFromDirectory(root + '/' + file, filterTemplate))
                  )
                )
              );
          }
          return EMPTY;
        }),

        mergeAll()
      );
  }

  /**
   *
   * @param path
   */
  private createDirectoryIfNotExists(path: string): Observable<Stats | void> {
    const stat$ = bindNodeCallback(stat);
    const mkdir$ = bindNodeCallback(mkdir);
    // Create diretory if not exists
    return stat$(path)
      .pipe(
        catchError(e => {
          if (e.code === 'ENOENT') {
            return mkdir$(path);
          }
          return throwError(e);
        }),
      );
  }

  /**
   *
   *
   * @param filePath
   * @param filesData
   */
  private writeFilesToDirectory(filePath: string, filesData: { [fileName: string]: Object }): Observable<Array<void>> {
    const writeFile$ = bindNodeCallback(writeFile);
    return forkJoin(
      Object.keys(filesData)
        .map(fileName => writeFile$(filePath + fileName, JSON.stringify(filesData[fileName])))
    );
  }

  /**
   * Read Json file and validate it.
   * return observable of parsed json file.
   *
   * @param filepath
   */
  private getFileContent(filepath: string): Observable<string> {
    const readFile$ = bindNodeCallback((
      path: string,
      encoding: string,
      callback: (error: Error, buffer: string) => void
    ) => readFile(path, encoding, callback));

    return readFile$(filepath, 'utf8');
  }

  private filterFiles(path: string): boolean {
    return this.template.test(extractFileName(path));
  }

  private changeFilename(filename: string, template: string): string {
    if ('(?:)' === template) {
      return filename;
    }

    const match = filename.match(new RegExp(template));

    if (!match) {
      return filename;
    }

    return match.slice(1).reduce((acc, cur, i) => acc.replace('$' + (i + 1), cur), this.targetTemplate);
  }
}
