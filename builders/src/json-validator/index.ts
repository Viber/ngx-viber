import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { bindNodeCallback, from, iif, merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, mergeMap, switchMap, tap, } from 'rxjs/operators';
import { readdir, readFile, stat, writeFile } from 'fs';
import { JsonValidatorBuilderSchema } from './schema';

export default class JsonValidatorBuilder implements Builder<JsonValidatorBuilderSchema> {
  private readonly readFile$ = bindNodeCallback((
    path: string,
    encoding: string,
    callback: (error: Error, buffer: string) => void
  ) => readFile(path, encoding, callback));
  private readonly stat$ = bindNodeCallback(stat);
  private readonly readdir$ = bindNodeCallback(readdir);
  private readonly writeFile$ = bindNodeCallback(writeFile);
  private dryRun: boolean = false;

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
    return this.stat$(fileName)
      .pipe(
        mergeMap(fileInfo =>
          iif(
            () => fileInfo.isDirectory(),
            this.readdir$(fileName)
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
  private validateFile(filepath: string): Observable<Set<string>> {
    const status: Set<string> = new Set();
    const logging = (info: string) => {
      info += filepath;
      this.context.logger.error(info);
      status.add(info);
    };

    return this.readFile$(filepath, 'utf8')
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
        switchMap(json => this.writeFile$(filepath, json)
          .pipe(
            map(() => logging('Updated file: '))
          )),
        mapTo(status)
      );
  }

  private hasBom(data: string): boolean {
    return data.startsWith('\uFEFF');
  }

  private removeBom(data: string): string {
    return data.replace(/^\uFEFF/, '');
  }

  private isValidJson(data): boolean {
    try {
      JSON.parse(data);
    } catch (e) {
      return false;
    }
    return true;
  }
}
