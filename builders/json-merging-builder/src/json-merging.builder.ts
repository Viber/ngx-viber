import {
  Builder,
  BuilderConfiguration,
  BuilderContext,
  BuildEvent,
} from '@angular-devkit/architect';
import { getSystemPath } from '@angular-devkit/core';
import {
  bindNodeCallback,
  forkJoin,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  reduce,
  tap,
} from 'rxjs/operators';
import { JsonMergingBuilderSchema } from './schema';
import {
  readdirSync,
  readFileSync,
  statSync,
  writeFile,
} from 'fs';

export default class JsonMergingBuilder implements Builder<JsonMergingBuilderSchema> {
  private readonly writeFileObservable;
  private readonly systemPath: string;
  private template: RegExp;
  private nestedDirectories: boolean;

  constructor(private context: BuilderContext) {
    this.writeFileObservable = bindNodeCallback(writeFile);
    this.systemPath = getSystemPath(this.context.workspace.root);
  }

  run(builderConfig: BuilderConfiguration<Partial<JsonMergingBuilderSchema>>): Observable<BuildEvent> {
    const {targetPath, targetFilename, sourceList, fileTemplate, groupByName, nestedDirectories} = builderConfig.options;
    const path = `${this.systemPath}/${targetPath}/`;

    this.template = new RegExp(fileTemplate);
    this.nestedDirectories = nestedDirectories;

    if (groupByName) {
      return this.groupByName(path, sourceList);
    } else {
      return this.writeTargetFile(path + targetFilename, this.listToJson(sourceList, this.systemPath + '/'));
    }
  }

  private writeTargetFile(targetPath: string, targetJson: string): Observable<BuildEvent> {
    return this.writeFileObservable(targetPath, targetJson).pipe(
      map(() => ({success: true})),
      tap(() => this.context.logger.info('Merged json created')),
      catchError(e => {
        this.context.logger.error('Failed to create target json', e);
        return of({success: false});
      }),
    );
  }

  private fileToObject(filepath: string) {
    if (!filepath.includes('.json') || !this.filter(filepath)) {
      return {};
    }

    try {
      return JSON.parse(
        readFileSync(filepath, 'utf8')
          .replace(/^\uFEFF/, ''), // removes BOM
      );
    } catch (e) {
      this.context.logger.error('JSON parsing error: ' + filepath, e);
      return {};
    }
  }

  private listToJson(list: Array<string>, root: string = ''): string {
    const directoriesList = list.map(path => `${root}${path}`);

    const jsonObject = directoriesList.reduce((target, dir) => {
        let jsonObj;

        if (statSync(dir).isFile()) {
          jsonObj = this.fileToObject(dir);
        } else {
          jsonObj = readdirSync(dir)
            .reduce((target, file) => {
              const path = dir + '/' + file;
              let obj;
              if (this.nestedDirectories && statSync(path).isDirectory()) {
                obj = JSON.parse(this.listToJson([path]));
              } else {
                obj = this.fileToObject(path);
              }
              return Object.assign(target, obj);
            }, {});
        }

        return Object.assign(target, jsonObj);
      }
      , {});

    return JSON.stringify(jsonObject);
  }

  private groupByName(targetPath: string, list: Array<string>): Observable<BuildEvent> {
    const pathList = list.map(path => `${this.systemPath}/${path}`);
    const target = this.getFilesList(pathList, {});

    return <Observable<BuildEvent>>forkJoin(Object.keys(target).map(k => {
      const json = this.listToJson(target[k]);
      return this.writeTargetFile(targetPath + k, json);
    })).pipe(reduce((acc, val) => ({success: true})));
  }

  private getFilesList(pathList: Array<string>, target: Object) {
    const targetPush = (path: string, file: string) => {
      if (!target[file]) {
        target[file] = [];
      }
      target[file].push(path + file);
    };

    pathList.forEach(path => {
      if (statSync(path).isFile()) {
        targetPush(path, path.split('/').pop());
      } else {
        readdirSync(path)
          .forEach(file => {
            if (this.nestedDirectories && statSync(path + file).isDirectory()) {
              target = this.getFilesList([path + file + '/'], target);
            } else if (statSync(path + '/' + file).isFile()) {
              targetPush(path + '/', file);
            }
          });
      }
    }, {});

    return target;
  }

  private filter(path: string): boolean {
    return this.template.test(path.split('/').pop());
  }
}