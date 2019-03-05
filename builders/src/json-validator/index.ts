import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { Stats } from '@angular-devkit/core/src/virtual-fs/host';
import { bindNodeCallback, from, iif, merge, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, finalize, map, mapTo, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { readdir, readFile, stat, writeFile } from 'fs';
import { JsonValidatorBuilderSchema } from './schema';

export default class JsonValidatorBuilder implements Builder<JsonValidatorBuilderSchema> {
  private dryRun: boolean;

  constructor(protected context: BuilderContext) {
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonValidatorBuilderSchema>>): Observable<BuildEvent> {
    const {checkList, dryRun} = builderConfig.options;
    const systemPath = getSystemPath(this.context.workspace.root);
    this.dryRun = dryRun;

    return from(checkList)
      .pipe(
        mergeMap((source: string) => this.getFiles(systemPath + '/' + source)),
        mergeMap((fileName: string) => this.validateFile(fileName)),
        mapTo({success: true})
      );
  }

  /**
   * Finds all files we want to work with
   * @param fileName
   */
  private getFiles(fileName: string): Observable<string> {
    return this.isDirectory(fileName)
      .pipe(
        mergeMap(isDirectory =>
          iif(
            () => isDirectory,
            this.getDirectoryList(fileName)
              .pipe(
                mergeMap((files: Array<string>) =>
                  merge(...files.map(file => this.getFiles(fileName + '/' + file))))
              ),
            of(fileName)
              .pipe(
                filter(file => file.endsWith('.json'))
              )
          )
        )
      );
  }

  /**
   * 1. Read file
   * 2. Check file have a BOM
   * 3. Remove BOM
   * 4. Write File
   * @param filepath
   */
  private validateFile(filepath: string): Observable<Array<string>> {
    const status: Array<string> = [];
    const status$: Subject<Array<string>> = new Subject();
    const logging = (info: string) => {
      info += filepath;
      this.context.logger.error(info);
      status.push(info);
    };

    this.getFileContent(filepath)
      .pipe(
        filter(json => !this.isValidJson(json)),
        filter(json => {
          const hasBom: boolean = this.hasBom(json);
          logging(hasBom ? 'There is BOM: ' : 'Parsing error: ');
          return hasBom;
        }),
        map(json => this.removeBom(json)),
        filter(json => {
          const isValid: boolean = this.isValidJson(json);
          if (!isValid) {
            logging('Parsing error: ');
          }
          return isValid;
        }),
        filter(() => !this.dryRun),
        switchMap(json => this.updateFile(filepath, json)
          .pipe(
            tap(() => logging('Updated file: '))
          )),
      ).subscribe(() => {
    }, () => {
    }, () => status$.next(status));

    return status$;
  }

  /**
   * Checks if the file has BOM
   * @param data
   */
  private hasBom(data: string): boolean {
    return data.startsWith('\uFEFF');
  }

  /**
   * Removes BOM form the file
   * @param data
   */
  private removeBom(data: string): string {
    return data.replace(/^\uFEFF/, '');
  }

  /**
   * Parses the file and checks if it's valid
   * @param data
   */
  private isValidJson(data): boolean {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Reads Json file
   * @param filepath
   * @return observable of json file
   */
  private getFileContent(filepath: string): Observable<string> {
    return bindNodeCallback((
      path: string,
      encoding: string,
      callback: (error: Error, buffer: string) => void
    ) => readFile(path, encoding, callback))(filepath, 'utf8');
  }

  /**
   * Updates the file with valid json (without BOM)
   * @param filepath
   * @param json
   */
  private updateFile(filepath: string, json: string): Observable<void> {
    return bindNodeCallback(writeFile)(filepath, json);
  }

  /**
   * Checks if it's directory
   * @param filepath
   */
  private isDirectory(filepath: string): Observable<boolean> {
    return bindNodeCallback(stat)(filepath).pipe(
      map((fileInfo: Stats) => fileInfo.isDirectory())
    );
  }

  /**
   * Gets the directory content
   * @param dir
   * @return observable of content list
   */
  private getDirectoryList(dir: string): Observable<Object> {
    return bindNodeCallback(readdir)(dir);
  }
}
