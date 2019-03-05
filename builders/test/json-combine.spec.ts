import { Architect, BuilderContext } from '@angular-devkit/architect';
import { concatMap, map, mergeMap, reduce, tap } from 'rxjs/operators';
import { experimental, logging, normalize, Path, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { mkdir, rmdir, unlink, writeFile } from 'fs';
import { bindNodeCallback, merge } from 'rxjs';
import JsonCombineBuilder from '../src/json-combine';

interface BrowserTargetOptions {
  browserOption: number;
  optionalBrowserOption: boolean;
}

class JsonCombineBuilderTesting extends JsonCombineBuilder {
  constructor(protected context: BuilderContext) {
    super(context);
  }

  public getPrivatePropertyForTesting(method: string) {
    return this[method];
  }
}

const workspaceJson = {
  version: 1,
  newProjectRoot: 'src',
  projects: {
    app: {
      root: 'app',
      sourceRoot: 'app/src',
      projectType: 'application',
      architect: {
        'json-combine': {
          'builder': '../../../../dist/builders:json-combine',
          'options': {
            'targetPath': 'src/assets/json-merging-builder-test/target',
            'filenameTemplate': 'locale-',
            'targetFilenameTemplate': 'global-$1.json',
            'sourceList': []
          }
        }
      },
    },
  },
};

const files = {
  'test.json': '{"d": {"d1": "d1d1d1", "d2": 12345, "d3": true, "d4": [1, "ddd", 2], "d5": {"dd1": "d2d2d2", "dd2": {"ddd1": "d3d3d3"}}}}'
};

describe('Combine', () => {
  const host = new NodeJsSyncHost();
  const workspace = new experimental.workspace.Workspace(normalize(__dirname), host);
  const targetSpec = {project: 'app', target: 'json-combine'};
  const jsonData = JSON.parse(files['test.json']);
  const jsonPath = normalize(__dirname + '/test.json') as Path;
  const dirPath = normalize(__dirname + '/test_directory');

  let architect: Architect;
  let builderConfig;
  let jsonCombineBuilder: JsonCombineBuilderTesting;

  beforeEach(done => workspace.loadWorkspaceFromJson(workspaceJson).pipe(
    concatMap(_workspace => new Architect(_workspace).loadArchitect()),
    map(_architect => {
      architect = _architect;
      builderConfig = architect.getBuilderConfiguration<BrowserTargetOptions>(targetSpec);
      jsonCombineBuilder = new JsonCombineBuilderTesting({
        logger: new logging.NullLogger(),
        host: host,
        workspace: workspace,
        architect: architect,
      });
      jsonCombineBuilder.run(builderConfig);
      bindNodeCallback(writeFile)(jsonPath, files['test.json']).subscribe(() => done());
    }),
  ).toPromise().then(done, done.fail));

  afterEach(done => {
    bindNodeCallback(unlink)(jsonPath).subscribe(() => done(), () => done());

    merge(
      bindNodeCallback(unlink)(dirPath + '/test1.json'),
      bindNodeCallback(unlink)(dirPath + '/test2.json'),
      bindNodeCallback(unlink)(dirPath + '/a/test3.json')
        .pipe(mergeMap(() => bindNodeCallback(rmdir)(dirPath + '/a'))
        )
    ).subscribe(() => done(), () => done(),
      () => bindNodeCallback(rmdir)(dirPath).subscribe(() => done(), () => done()));

    bindNodeCallback(rmdir)(dirPath).subscribe(() => done(), () => done());
  });

  describe('filter files by template', () => {
    let filterFiles;

    beforeEach(() => filterFiles = jsonCombineBuilder.getPrivatePropertyForTesting('filterFiles').bind(jsonCombineBuilder));

    it('pass filter', () => expect(filterFiles('./aaa/bbb/ccc/locale-d.json')).toBeTruthy());

    it('not pass filter', () => expect(filterFiles('./aaa/bbb/ccc/d.json')).toBeFalsy());
  });

  describe('change filename', () => {
    let changeFilename;

    beforeEach(() => changeFilename = jsonCombineBuilder.getPrivatePropertyForTesting('changeFilename').bind(jsonCombineBuilder));

    it('change', () => expect(changeFilename('locale-d.json', 'locale-([a-z]{1,3})')).toBe('global-d.json'));

    it('not change', () => expect(changeFilename('d.json', 'locale-([a-z]{1,3})')).toBe('d.json'));
  });

  it('get file content', done => {
    const getFileContent = jsonCombineBuilder.getPrivatePropertyForTesting('getFileContent').bind(jsonCombineBuilder);
    getFileContent(jsonPath).subscribe(json => {
      expect(JSON.parse(json)).toEqual(jsonData);
      done();
    });
  });

  it('write files to directory', done => {
    const writeFilesToDirectory = jsonCombineBuilder.getPrivatePropertyForTesting('writeFilesToDirectory').bind(jsonCombineBuilder);
    writeFilesToDirectory(normalize(__dirname) + '/', {'test.json': jsonData}).pipe(
      mergeMap(() => host.exists(jsonPath)),
      tap(exists => expect(exists).toBeTruthy()),
      mergeMap(() => host.read(jsonPath)),
      tap((json: ArrayBuffer) => expect(JSON.parse(virtualFs.fileBufferToString(json))).toEqual(jsonData))
    ).subscribe(() => done());
  });

  it('create directory if not exists', done => {
    const createDirectoryIfNotExists =
      jsonCombineBuilder.getPrivatePropertyForTesting('createDirectoryIfNotExists').bind(jsonCombineBuilder);

    createDirectoryIfNotExists(dirPath).pipe(
      mergeMap(() => host.exists(dirPath)),
      tap(exists => expect(exists).toBeTruthy())
    ).subscribe(() => done());
  });

  it('getFilesListFromDirectory', done => {
    const getFilesListFromDirectory =
      jsonCombineBuilder.getPrivatePropertyForTesting('getFilesListFromDirectory').bind(jsonCombineBuilder);

    bindNodeCallback(mkdir)(dirPath).pipe(
      mergeMap(() => bindNodeCallback(writeFile)(dirPath + '/test1.json', files['test.json'])),
      mergeMap(() => bindNodeCallback(writeFile)(dirPath + '/test2.json', files['test.json'])),
      mergeMap(() => bindNodeCallback(mkdir)(dirPath + '/a')
        .pipe(mergeMap(() => bindNodeCallback(writeFile)(dirPath + '/a/test3.json', files['test.json'])))
      ),
      mergeMap(() => getFilesListFromDirectory(dirPath, new RegExp('test')).pipe(
        reduce((acc: Object, file: { path: string, filter: string }) => {
          acc[file.path.split('/').pop()] = file.path;
          return acc;
        }, {}),
        tap(filesObject => {
          expect(filesObject['test1.json']).toBe(normalize(__dirname + '/test_directory/test1.json'));
          expect(filesObject['test2.json']).toBe(normalize(__dirname + '/test_directory/test2.json'));
          expect(filesObject['test3.json']).toBe(normalize(__dirname + '/test_directory/a/test3.json'));
        })
      )),
      mergeMap(() => getFilesListFromDirectory(dirPath, new RegExp('test'), false).pipe(
        reduce((acc: Object, file: { path: string, filter: string }) => {
          acc[file.path.split('/').pop()] = file.path;
          return acc;
        }, {}),
        tap(filesObject => expect(filesObject).toEqual({}))
      ))
    ).subscribe(() => done());
  });
});
