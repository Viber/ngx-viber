import { runTargetSpec } from '@angular-devkit/architect/testing';
import { BuildEvent } from '@angular-devkit/architect';
import { tap } from 'rxjs/operators';
import { host, jsonCombineTargetSpec } from '../utils';

describe('Combine', () => {
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
    'error.json': '"r": {"r1": "r1r1r1", "r2": 12345, "r3": true, "r4": [1, "rrr", 2], "r5": {"rr1": "r2r2r2", "rr2": {"rrr1": "r3r3r3"}}}}'
  };

  // it('test', (done) => {
  //   expect(true).toBe(true);
  //   done();
  // }, 30000);

  beforeEach(done => host
    .initialize()
    .toPromise()
    .then(done, done.fail)
  );

  afterEach(done => host
    .restore()
    .toPromise()
    .then(done, done.fail)
  );

  it('works', done => {
    runTargetSpec(host, jsonCombineTargetSpec).pipe(
      tap((buildEvent: BuildEvent) => expect(buildEvent.success).toBe(true)),
    )
      .toPromise()
      .then(done, done.fail);
  }, 30000);
});
