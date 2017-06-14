import { install } from 'npm-programmatic';

export const dependencies = {
  dev: {
    service: [],
    lib: [],
    common: [
      '@repositive/typescript',
      '@types/sinon',
      '@types/node',
      '@types/tape',
      'husky',
      'nyc',
      'sinon',
      'tap-spec',
      'tape',
      'tslint',
      'typescript'
    ]
  },
  main: {
    service: [],
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
