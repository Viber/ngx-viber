import {Architect, BuilderContext} from '@angular-devkit/architect';
import {experimental, logging, normalize, Path, virtualFs} from '@angular-devkit/core';
import {NodeJsSyncHost} from '@angular-devkit/core/node';
import {unlink, writeFile} from 'fs';
import {bindNodeCallback, merge} from 'rxjs';
import {concatMap, map, tap} from 'rxjs/operators';
import JsonValidatorBuilder, {CheckedFile, JsonStatuses} from '../src/json-validator';

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
  'bom.json': '\uFEFF{"b": {"b1": "b1b1b1", "b2": 12345, "b3": true}}',
  'err.json': '"r": {"r1": "r1r1r1", "r2": 12345, "r3": true, "r4": [1, "rrr", 2], "r5": {"rr1": "r2r2r2", "rr2": {"rrr1": "r3r3r3"}}}}',
  'test.err': 'jjj jjj jjj'
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
        logger: new logging.NullLogger(),
        host: host,
        workspace: workspace,
        architect: architect,
      });
      jsonValidatorBuilder.run(builderConfig);
      merge(
        ...Object.keys(files).map(file => bindNodeCallback(writeFile)(jsonPath(file), files[file]))
      ).subscribe(() => done(), () => done());
    }),
  ).toPromise().then(done, done.fail));

  afterEach(done => {
    merge(
      ...Object.keys(files).map(file => bindNodeCallback(unlink)(jsonPath(file)))
    ).subscribe(() => done(), () => done());
  });

  describe('Is Valid Json', () => {
    let isValidJson;

    beforeEach(() => isValidJson = jsonValidatorBuilder.getPrivatePropertyForTesting('isValidJson').bind(jsonValidatorBuilder));

    it('valid json', done => host.read(jsonPath('test.json'))
      .pipe(
        tap(json => expect(isValidJson(virtualFs.fileBufferToString(json))).toBeTruthy())
      ).subscribe(() => done()));

    it('valid json with BOM', done => host.read(jsonPath('bom.json'))
      .pipe(
        tap(json => expect(isValidJson(virtualFs.fileBufferToString(json))).toBeFalsy())
      ).subscribe(() => done()));

    it('invalid json', done => host.read(jsonPath('err.json'))
      .pipe(
        tap(json => expect(isValidJson(virtualFs.fileBufferToString(json))).toBeFalsy())
      ).subscribe(() => done()));

    it('not json', done => host.read(jsonPath('test.err'))
      .pipe(
        tap(json => expect(isValidJson(virtualFs.fileBufferToString(json))).toBeFalsy())
      ).subscribe(() => done()));
  });

  describe('BOM', () => {
    let hasBom;
    let removeBom;

    beforeEach(() => {
      hasBom = jsonValidatorBuilder.getPrivatePropertyForTesting('hasBom').bind(jsonValidatorBuilder);
      removeBom = jsonValidatorBuilder.getPrivatePropertyForTesting('removeBom').bind(jsonValidatorBuilder);
    });

    it('json without BOM', done => host.read(jsonPath('test.json'))
      .pipe(
        tap(json => expect(hasBom(virtualFs.fileBufferToString(json))).toBeFalsy())
      ).subscribe(() => done()));

    it('json with BOM', done => host.read(jsonPath('bom.json'))
      .pipe(
        tap(json => expect(hasBom(virtualFs.fileBufferToString(json))).toBeTruthy())
      ).subscribe(() => done()));

    it('removing BOM', done => host.read(jsonPath('bom.json'))
      .pipe(
        map(json => removeBom(virtualFs.fileBufferToString(json))),
        tap(json => expect(hasBom(json)).toBeFalsy())
      ).subscribe(() => done()));
  });

  describe('Validate Json', () => {
    let validateFile;

    beforeEach(() => validateFile = jsonValidatorBuilder.getPrivatePropertyForTesting('validateFile').bind(jsonValidatorBuilder));

    it('valid json', done => validateFile(jsonPath('test.json'))
      .pipe(
        tap((status: CheckedFile) => {
          expect(status.name).toEqual(jsonPath('test.json'));
          expect(status.status.has(JsonStatuses.WITH_BOM)).toBeFalsy();
          expect(status.status.has(JsonStatuses.UPDATED)).toBeFalsy();
          expect(status.status.has(JsonStatuses.FAILED_TO_PARSE)).toBeFalsy();
        })
      ).subscribe(() => done(), () => done(), () => done()));

    it('valid json with BOM', done => validateFile(jsonPath('bom.json'))
      .pipe(
        tap((status: CheckedFile) => {
          expect(status.name).toEqual(jsonPath('bom.json'));
          expect(status.status.has(JsonStatuses.WITH_BOM)).toBeTruthy();
          expect(status.status.has(JsonStatuses.UPDATED)).toBeTruthy();
          expect(status.status.has(JsonStatuses.FAILED_TO_PARSE)).toBeFalsy();
        })
      ).subscribe(() => done(), () => done(), () => done()));

    it('valid json with BOM (dry run)', done => {
      builderConfig.options.dryRun = true;
      jsonValidatorBuilder.run(builderConfig);
      validateFile(jsonPath('bom.json'))
        .pipe(
          tap((status: CheckedFile) => {
            expect(status.name).toEqual(jsonPath('bom.json'));
            expect(status.status.has(JsonStatuses.WITH_BOM)).toBeTruthy();
            expect(status.status.has(JsonStatuses.UPDATED)).toBeFalsy();
            expect(status.status.has(JsonStatuses.FAILED_TO_PARSE)).toBeFalsy();
          })
        ).subscribe(() => done(), () => done(), () => done());
    });

    it('invalid json', done => validateFile(jsonPath('err.json'))
      .pipe(
        tap((status: CheckedFile) => {
          expect(status.name).toEqual(jsonPath('err.json'));
          expect(status.status.has(JsonStatuses.WITH_BOM)).toBeFalsy();
          expect(status.status.has(JsonStatuses.UPDATED)).toBeFalsy();
          expect(status.status.has(JsonStatuses.FAILED_TO_PARSE)).toBeTruthy();
        })
      ).subscribe(() => done(), () => done(), () => done()));

    it('not json', done => validateFile(jsonPath('test.err'))
      .pipe(
        tap((status: CheckedFile) => {
          expect(status.name).toEqual(jsonPath('test.err'));
          expect(status.status.has(JsonStatuses.WITH_BOM)).toBeFalsy();
          expect(status.status.has(JsonStatuses.UPDATED)).toBeFalsy();
          expect(status.status.has(JsonStatuses.FAILED_TO_PARSE)).toBeTruthy();
        })
      ).subscribe(() => done(), () => done(), () => done()));
  });
});
