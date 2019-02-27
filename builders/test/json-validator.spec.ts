import { Architect, BuilderContext } from '@angular-devkit/architect';
import { concatMap, mergeMap, reduce, tap } from 'rxjs/operators';
import { experimental, logging, normalize, Path, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { mkdir, rmdir, unlink, writeFile } from 'fs';
import { bindNodeCallback, merge } from 'rxjs';
import JsonValidatorBuilder from '../src/json-validator';

interface BrowserTargetOptions {
  browserOption: number;
  optionalBrowserOption: boolean;
}

class JsonValidatorBuilderTesting extends JsonValidatorBuilder {
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
  'test.json': '{"d": {"d1": "d1d1d1", "d2": 12345, "d3": true, "d4": [1, "ddd", 2], "d5": {"dd1": "d2d2d2", "dd2": {"ddd1": "d3d3d3"}}}}',
  'e.error': 'jjj jjj jjj',
  'error.json': '"r": {"r1": "r1r1r1", "r2": 12345, "r3": true, "r4": [1, "rrr", 2], "r5": {"rr1": "r2r2r2", "rr2": {"rrr1": "r3r3r3"}}}}'
};

describe('Validator', () => {
  const host = new NodeJsSyncHost();
  const workspace = new experimental.workspace.Workspace(normalize(__dirname), host);
  const targetSpec = {project: 'app', target: 'json-combine'};
  const jsonData = JSON.parse(files['test.json']);
  const jsonPath = normalize(__dirname + '/test.json') as Path;
  const dirPath = normalize(__dirname + '/test_directory');

  let architect: Architect;
  let builderConfig;
  let jsonValidatorBuilder: JsonValidatorBuilderTesting;

  beforeEach(done => workspace.loadWorkspaceFromJson(workspaceJson).pipe(
    concatMap(_workspace => new Architect(_workspace).loadArchitect()),
    tap(_architect => {
      architect = _architect;
      builderConfig = architect.getBuilderConfiguration<BrowserTargetOptions>(targetSpec);
      jsonValidatorBuilder = new JsonValidatorBuilderTesting({
        logger: new logging.NullLogger(),
        host: host,
        workspace: workspace,
        architect: architect,
      });
      jsonValidatorBuilder.run(builderConfig);
      bindNodeCallback(writeFile)(jsonPath, files['test.json']).subscribe(() => done());
    }),
  ).toPromise().then(done, done.fail));

  afterEach(function (done) {
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

  it('checkFile', done => {
    const checkFile = jsonValidatorBuilder.getPrivatePropertyForTesting('checkFile').bind(jsonValidatorBuilder);

  });

  it('checkFiles', done => {
    const checkFiles = jsonValidatorBuilder.getPrivatePropertyForTesting('checkFiles').bind(jsonValidatorBuilder);

  });
});
