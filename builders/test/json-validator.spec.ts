import { Architect, BuilderContext } from '@angular-devkit/architect';
import { concatMap, count, map, tap } from 'rxjs/operators';
import { experimental, logging, normalize, Path } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { LogEntry } from '@angular-devkit/core/src/logger';
import { unlink, writeFile } from 'fs';
import { bindNodeCallback, EMPTY, forkJoin, merge } from 'rxjs';
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
        'json-validator': {
          'builder': '../../../../dist/builders:json-validator',
          'options': {
            'checkList': []
          }
        }
      },
    },
  },
};

const files = {
  'test.json': '{"d": {"d1": "d1d1d1", "d2": 12345, "d3": true, "d4": [1, "ddd", 2], "d5": {"dd1": "d2d2d2", "dd2": {"ddd1": "d3d3d3"}}}}',
  'test.err': 'jjj jjj jjj',
  'err.json': '"r": {"r1": "r1r1r1", "r2": 12345, "r3": true, "r4": [1, "rrr", 2], "r5": {"rr1": "r2r2r2", "rr2": {"rrr1": "r3r3r3"}}}}'
};

describe('Validator', () => {
  const host = new NodeJsSyncHost();
  const workspace = new experimental.workspace.Workspace(normalize(__dirname), host);
  const targetSpec = {project: 'app', target: 'json-validator'};
  const jsonPath = file => normalize(__dirname + '/' + file) as Path;

  let architect: Architect;
  let builderConfig;
  let jsonValidatorBuilder: JsonValidatorBuilderTesting;

  beforeEach(done => workspace.loadWorkspaceFromJson(workspaceJson).pipe(
    concatMap(_workspace => new Architect(_workspace).loadArchitect()),
    map(_architect => {
      architect = _architect;
      builderConfig = architect.getBuilderConfiguration<BrowserTargetOptions>(targetSpec);
      jsonValidatorBuilder = new JsonValidatorBuilderTesting({
        logger: new logging.Logger('test'),
        host: host,
        workspace: workspace,
        architect: architect,
      });
      jsonValidatorBuilder.run(builderConfig);
      merge(
        bindNodeCallback(writeFile)(jsonPath('test.json'), files['test.json']),
        bindNodeCallback(writeFile)(jsonPath('test.err'), files['test.err']),
        bindNodeCallback(writeFile)(jsonPath('err.json'), files['error.json'])
      ).subscribe(() => done(), () => done());
    }),
  ).toPromise().then(done, done.fail));

  afterEach(done => {
    merge(
      bindNodeCallback(unlink)(jsonPath('test.json')),
      bindNodeCallback(unlink)(jsonPath('test.err')),
      bindNodeCallback(unlink)(jsonPath('err.json'))
    ).subscribe(() => done(), () => done());
  });

  it('checkFile', done => {
    const checkFile = jsonValidatorBuilder.getPrivatePropertyForTesting('checkFile').bind(jsonValidatorBuilder);
    const logger = jsonValidatorBuilder.getPrivatePropertyForTesting('context').logger;

    logger
      .pipe(
        tap((err: LogEntry) => expect(err.message).toMatch(/^Parsing error:.*(test.err|err.json)$/)),
        count(),
        tap(errors => expect(errors).toBe(2))
      )
      .subscribe(() => done());

    forkJoin(
      checkFile(jsonPath('test.json')).pipe(tap((json => expect(json).toEqual({success: true})))),
      checkFile(jsonPath('err.json')).pipe(tap((json => expect(json).toEqual({success: true})))),
      checkFile(jsonPath('test.err')).pipe(tap((json => expect(json).toEqual({success: true}))))
    ).subscribe(() => {
      logger.complete();
      done();
    });
  });

  it('checkFiles', done => {
    const checkFiles = jsonValidatorBuilder.getPrivatePropertyForTesting('checkFiles').bind(jsonValidatorBuilder);
    merge(
      checkFiles(jsonPath('test.json')).pipe(tap((json => expect(json).toEqual({success: true})))),
      checkFiles(jsonPath('err.json')).pipe(tap((json => expect(json).toEqual({success: true})))),
      checkFiles(jsonPath('test.err')).pipe(tap((json => expect(json).toEqual(EMPTY))))
    ).subscribe(() => done());
  });
});
