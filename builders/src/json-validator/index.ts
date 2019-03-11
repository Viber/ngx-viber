import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuildEvent,
} from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import { Stats } from '@angular-devkit/core/src/virtual-fs/host';
import {
  readdir,
  readFile,
  stat,
  writeFile
} from 'fs';
import {
  bindNodeCallback,
  from,
  iif,
  merge,
  Observable,
  of,
  Subject
} from 'rxjs';
import {
  concatMap,
  delayWhen,
  filter,
  groupBy,
  map,
  mapTo,
  mergeMap,
  reduce,
  scan,
  switchMap,
  tap,
  toArray
} from 'rxjs/operators';
import { JsonValidatorBuilderSchema } from './schema';

type JsonStatus = 'bom' | 'parse' | 'update' | 'ok';

enum JsonStatuses {
  WITH_BOM = 'WITH_BOM',
  UPDATED = 'UPDATED',
  FAILED_TO_PARSE = 'FAILED_TO_PARSE'
}


const messages = {
  bom: 'There is BOM: ',
  parse: 'Parsing error: ',
  update: 'Updated file: ',
  passed: 'Passed file: ',
};

interface CheckedFile {
  name: string;
  status: Set<JsonStatuses>;
}


interface JsonResult {
  status: JsonStatus;
  message: string;
}

export default class JsonValidatorBuilder implements Builder<JsonValidatorBuilderSchema> {
  private dryRun: boolean;

  constructor(protected context: BuilderContext) {
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonValidatorBuilderSchema>>): Observable<BuildEvent> {
    const {checkList, dryRun} = builderConfig.options;
    const systemPath = getSystemPath(this.context.workspace.root);
    let success: boolean = true;
    let nParsingError: number = 0;
    let nHasBom: number = 0;
    this.dryRun = dryRun;

    const hz: Subject<BuildEvent> = new Subject();

    from(checkList)
      .pipe(
        mergeMap((source: string) => this.getFiles(systemPath + '/' + source)),
        mergeMap((fileName: string) => this.validateFile(fileName)),

        reduce((acc, status: CheckedFile) => {
          acc.push(status);
          return acc;
        }, []),

        // groupBy((status: Array<JsonResult>) => 'undefined' === typeof status[0] ? 'ok' : status[0].status),
        // mergeMap(group => group.pipe(toArray())),
        // reduce((acc, status: Array<JsonResult>) => {
        //   status.forEach(s => acc[s.status] = s.message);
        //   return acc;
        // }, {}),
        // tap(
        //   statuses => {
        //     console.log('next *****', statuses);
        //     // status.forEach(s => {
        //     // if (s.startsWith('Parsing error:')) {
        //     //   success = false;
        //     //   throw 'Parsing error: ' + (++nParsingError) + ' files';
        //     // }
        //     //
        //     // if (dryRun && s.startsWith('There is BOM:')) {
        //     //   success = false;
        //     //   throw 'There is BOM: ' + (++nHasBom) + ' files';
        //     // }
        //     // });
        //     // return statuses;
        //   },
        //   error => console.log('error *****', error),
        //   () => console.log('Complete')
        // ),
        // mapTo({success: success})
      )
      .subscribe(statuses => {
          statuses.forEach(
            status => console.log('['
              + (status.status.has(JsonStatuses.FAILED_TO_PARSE) ? 'P' : ' ')
              + (status.status.has(JsonStatuses.WITH_BOM) ? 'B' : ' ')
              + (status.status.has(JsonStatuses.UPDATED) ? 'U' : ' ')
              + ']' + ' ' + status.name
            )
          );

          const isFail = statuses.find(status => status.status.has(JsonStatuses.FAILED_TO_PARSE));

          hz.next({success: !isFail});
          hz.complete();
          // status.forEach(s => {
          // if (s.startsWith('Parsing error:')) {
          //   success = false;
          //   throw 'Parsing error: ' + (++nParsingError) + ' files';
          // }
          //
          // if (dryRun && s.startsWith('There is BOM:')) {
          //   success = false;
          //   throw 'There is BOM: ' + (++nHasBom) + ' files';
          // }
          // });
          // return statuses;
        },
        error => {

          hz.next({success: success});
          hz.complete();
        },
        () => {
          hz.next({success: success});
          hz.complete();
        }
      );

    return hz;
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
  private validateFile(filepath: string): Observable<CheckedFile> {
    const status$: Subject<CheckedFile> = new Subject();

    const fileStatus: CheckedFile = {
      name: filepath,
      status: new Set()
    };

    this.getFileContent(filepath)
      .pipe(
        filter(json => {
          const isValid = this.isValidJson(json);

          if (!isValid) {
            // Set status failed to parse
            fileStatus.status.add(JsonStatuses.FAILED_TO_PARSE);
          }

          return !isValid;
        }),


        filter(json => {

          const hasBom: boolean = this.hasBom(json);
          if (hasBom) {
            // Set status failed to parse
            fileStatus.status.add(JsonStatuses.WITH_BOM);
            // Remove failed to parse, since we have a bom situation
            fileStatus.status.delete(JsonStatuses.FAILED_TO_PARSE);
          }

          return hasBom;
        }),

        map(json => this.removeBom(json)),

        filter(json => {
          const isValid = this.isValidJson(json);

          if (!isValid) {
            // Set status failed to parse
            fileStatus.status.add(JsonStatuses.FAILED_TO_PARSE);
          }

          return isValid;
        }),

        filter(() => !this.dryRun),

        switchMap(json => this.updateFile(filepath, json)
          .pipe(
            tap(() => {
              fileStatus.status.add(JsonStatuses.UPDATED);
            })
          )),
      )
      .subscribe(
        () => {
        },
        () => {
        },
        () => {
          status$.next(fileStatus);
          status$.complete();
        });

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
