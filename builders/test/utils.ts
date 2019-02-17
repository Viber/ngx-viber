import { TestProjectHost } from '@angular-devkit/architect/testing';
import { Path, join, normalize } from '@angular-devkit/core';

// const devkitRoot = normalize('/home/alexander/Documents/projects/ngx-viber/src');
// const workspaceRoot = join(devkitRoot, '');
const workspaceRoot = normalize('/home/alexander/Documents/projects/ngx-viber/dist/test/json-combine/app-test');

export const host = new TestProjectHost(workspaceRoot);
export const outputPath: Path = normalize('dist');

export const jsonCombineTargetSpec = { project: 'app-test', target: 'json-combine' };
export const jsonValidatorTargetSpec = { project: 'app-test', target: 'json-validator' };
