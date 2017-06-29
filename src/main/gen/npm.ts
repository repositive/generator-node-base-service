import { install } from 'npm-programmatic';

export const dependencies = {
  dev: {
    service: [
      '@types/hapi',
      '@types/config',
      '@types/bluebird'
    ],
    lib: [],
    common: [
      '@repositive/typescript',
      '@types/sinon',
      '@types/node',
      '@types/proxyquire',
      '@types/tape',
      'nodemon',
      'husky',
      'nyc',
      'proxyquire',
      'sinon',
      'tap-spec',
      'tape',
      'tslint',
      'typescript'
    ]
  },
  main: {
    service: [
      'hapi',
      '@repositive/hapi-route-loader',
      'config',
      'bluebird'
    ],
    lib: [],
    common: []
  }
};

async function installHelper(deps: string[], ops: any) {
  const comOps = {output: false, cwd: process.cwd()};
  if (deps.length > 0) {
    return install(deps, Object.assign({}, comOps, ops));
  }
}

export async function installDependencies(args: any) {
  await installHelper(dependencies.dev.common, {saveDev: true});
  await installHelper(dependencies.dev[args.mode], {saveDev: true});
  await installHelper(dependencies.main.common, {save: true});
  await installHelper(dependencies.main[args.mode], {save: true});
}
