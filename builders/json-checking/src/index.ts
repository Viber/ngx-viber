import { Builder, BuilderConfiguration, BuilderContext, BuildEvent, } from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { bindNodeCallback, EMPTY, from, merge, Observable, of, } from 'rxjs';
import { catchError, map, mapTo, mergeAll, mergeMap, } from 'rxjs/operators';
import { JsonCheckingBuilderSchema } from './schema';
import { readdir, readFile, stat, writeFile } from 'fs';

export default class JsonCheckingBuilder implements Builder<JsonCheckingBuilderSchema> {
  private readonly writeFile$ = bindNodeCallback(writeFile);
  private readonly readFile$ = bindNodeCallback((
    path: string,
    encoding: string,
    callback: (error: Error, buffer: string) => void
  ) => readFile(path, encoding, callback));
  private readonly stat$ = bindNodeCallback(stat);
  private readonly readdir$ = bindNodeCallback(readdir);
  private removeBOM: boolean;

  constructor(private context: BuilderContext) {
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonCheckingBuilderSchema>>): Observable<BuildEvent> {
    const {checkList, removeBOM} = builderConfig.options;
    const systemPath = getSystemPath(this.context.workspace.root);
    this.removeBOM = removeBOM;

    return from(<Array<string>>checkList)
      .pipe(
        mergeMap((source: string) => this.checkFiles(systemPath + '/' + source)),
        mapTo({success: true})
      );
  }

  private checkFiles(root: string): Observable<BuildEvent> {
    return this.stat$(root)
      .pipe(
        map(fileInfo => {
          if (fileInfo.isFile() && root.endsWith('.json')) {
            return this.checkFile(root);
          }

          if (fileInfo.isDirectory()) {
            return this.readdir$(root)
              .pipe(
                mergeMap(files => merge(
                  ...files.map(file => this.checkFiles(root + '/' + file))
                  )
                )
              );
          }
          return EMPTY;
        }),

        mergeAll()
      );
  }

  private checkFile(filepath: string): Observable<BuildEvent> {
    return this.readFile$(filepath, 'utf8')
      .pipe(
        map((data: string) => {
          if (data.startsWith('\uFEFF')) {
            this.context.logger.error('There is BOM: ' + filepath);
            data = data.replace(/^\uFEFF/, '');
            if (this.removeBOM) {
              this.writeFile$(filepath, data)
                .pipe(catchError(e => {
                  throw e;
                }))
                .subscribe(() => this.context.logger.info('BOM is removed: ' + filepath));
            }
          }

          try {
            JSON.parse(data);
          } catch (e) {
            this.context.logger.error('Parsing error: ' + filepath, e);
          }
        }),
        mapTo({success: true})
      );
  }
}
