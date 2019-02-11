import { TestProjectHost } from '@angular-devkit/architect/testing';
import { Path, join, normalize } from '@angular-devkit/core';


const devkitRoot = normalize((global as any)._DevKitRoot);
const workspaceRoot = join(devkitRoot, 'tests/angular_devkit/build_angular/hello-world-app/');

export const host = new TestProjectHost(workspaceRoot);
export const outputPath: Path = normalize('dist');

export const jsonCombineTargetSpec = { project: 'app', target: 'json-combine' };
export const jsonValidatorTargetSpec = { project: 'app', target: 'json-validator' };
