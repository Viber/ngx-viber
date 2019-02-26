import { Architect, BuilderContext } from '@angular-devkit/architect';
import { concatMap, tap } from 'rxjs/operators';
import { experimental, getSystemPath, logging, normalize, Path, virtualFs } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import JsonCombineBuilder from '../../src/json-combine';

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
            'sourceList': [
              // {
              //   'source': 'src/assets/json-merging-builder-test/source/a',
              //   'filter': 'lalala-([a-z]{1,3})'
              // },
              // {
              //   'source': 'src/assets/json-merging-builder-test/source/b',
              //   'filter': 'lalala-([a-z]{1,3})'
              // },
              // 'src/assets/json-merging-builder-test/source/c',
              // 'src/assets/json-merging-builder-test/source/e',
              // 'src/assets/json-merging-builder-test/source/lalala-d.json'
            ]
          }
        }
      },
    },
  },
};

const files = {
  'a/lalala-xxx.json': '{"x1": {"x11": "x11x11x11", "x12": 12345, "x13": true, "x14": [1, "x1x1x1", 2], "x15": {"x1x11": "x12x12x12", "x1x12": {"x1x1x11": "x13x13x13"}}}}',
  'a/lalala-zzz.json': '{"z1": {"z11": "z11z11z11", "z12": 12345, "z13": true, "z14": [1, "z1z1z1", 2], "z15": {"z1z11": "z12z12z12", "z1z12": {"z1z1z11": "z13z13z13"}}}}',
  'a/yyy.json': '{"y1": {"y11": "y11y11y11", "y12": 12345, "y13": true, "y14": [1, "y1y1y1", 2], "y15": {"y1y11": "y12y12y12", "y1y12": {"y1y1y11": "y13y13y13"}}}}',
  'a/aaa/lalala-xxx.json': '{"x2": {"x21": "x21x21x21", "x22": 12345, "x23": true, "x24": [1, "x2x2x2", 2], "x25": {"x2x21": "x22x22x22", "x2x22": {"x2x2x21": "x23x23x23"}}}}',
  'a/aaa/lalala-zzz.json': '{"y2": {"y21": "y21y21y21", "y22": 12345, "y23": true, "y24": [1, "y2y2y2", 2], "y25": {"y2y21": "y22y22y22", "y2y22": {"y2y2y21": "y23y23y23"}}}}',
  'a/aaa/zzz.json': '{"z2": {"z21": "z21z21z21", "z22": 12345, "z23": true, "z24": [1, "z2z2z2", 2], "z25": {"z2z21": "z22z22z22", "z2z22": {"z2z2z21": "z23z23z23"}}}}',
  'b/lalala-xxx.json': '{"x3": {"x31": "x31x31x31", "x32": 12345, "x33": true, "x34": [1, "x3x3x3", 2], "x35": {"x3x31": "x32x32x32", "x3x32": {"x3x3x31": "x33x33x33"}}}}',
  'b/lalala-yyy.json': '{"y3": {"y31": "y31y31y31", "y32": 12345, "y33": true, "y34": [1, "y3y3y3", 2], "y35": {"y3y31": "y32y32y32", "y3y32": {"y3y3y31": "y33y33y33"}}}}',
  'b/lalala-zzz.json': '{"z3": {"z31": "z31z31z31", "z32": 12345, "z33": true, "z34": [1, "z3z3z3", 2], "z35": {"z3z31": "z32z32z32", "z3z32": {"z3z3z31": "z33z33z33"}}}}',
  'lalala-d.json': '{"d": {"d1": "d1d1d1", "d2": 12345, "d3": true, "d4": [1, "ddd", 2], "d5": {"dd1": "d2d2d2", "dd2": {"ddd1": "d3d3d3"}}}}',
  'e.error': 'jjj jjj jjj',
  'error.json': '"r": {"r1": "r1r1r1", "r2": 12345, "r3": true, "r4": [1, "rrr", 2], "r5": {"rr1": "r2r2r2", "rr2": {"rrr1": "r3r3r3"}}}}',
  'test.json': '{"a": "aaa", "b": 3}'
};

describe('Combine', () => {
  const host = new NodeJsSyncHost();
  const workspace = new experimental.workspace.Workspace(normalize(__dirname), host);
  const targetSpec = {project: 'app', target: 'json-combine'};

  let architect: Architect;
  let builderConfig;
  let jsonCombineBuilder: JsonCombineBuilderTesting;

  beforeEach(done => workspace.loadWorkspaceFromJson(workspaceJson).pipe(
    concatMap(_workspace => new Architect(_workspace).loadArchitect()),
    tap(_architect => {
      architect = _architect;
      builderConfig = architect.getBuilderConfiguration<BrowserTargetOptions>(targetSpec);
      jsonCombineBuilder = new JsonCombineBuilderTesting({
        logger: new logging.NullLogger(),
        host: host,
        workspace: workspace,
        architect: architect,
      });
      jsonCombineBuilder.run(builderConfig);
    }),
  ).toPromise().then(done, done.fail));

  afterEach(function () {
    // console.log(this.results_);
  });

  it('angular.json options', () => {
    expect(builderConfig.root).toBe('app');
    expect(builderConfig.sourceRoot).toBe('app/src' as Path);
    expect(builderConfig.projectType).toBe('application');
  });

  it('filterFiles', () => {
    const template = jsonCombineBuilder.getPrivatePropertyForTesting('template');
    const filterFiles = jsonCombineBuilder.getPrivatePropertyForTesting('filterFiles').bind(jsonCombineBuilder);
    expect(template.source).toBe('locale-');
    expect(filterFiles('./aaa/bbb/ccc/locale-d.json')).toBe(true);
    expect(filterFiles('./aaa/bbb/ccc/d.json')).toBe(false);
  });

  it('changeFilename', () => {
    const changeFilename = jsonCombineBuilder.getPrivatePropertyForTesting('changeFilename').bind(jsonCombineBuilder);
    expect(changeFilename('locale-d.json', 'locale-([a-z]{1,3})')).toBe('global-d.json');
    expect(changeFilename('d.json', 'locale-([a-z]{1,3})')).toBe('d.json');
  });

  it('getFileContent', done => {
    const getFileContent = jsonCombineBuilder.getPrivatePropertyForTesting('getFileContent').bind(jsonCombineBuilder);
    getFileContent(normalize(__dirname + '/test.json')).subscribe(json => {
      expect(json).toBe(files['lalala-d.json']);
      done();
    });
  });
});
