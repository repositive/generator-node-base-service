const pack = require('../../package.json');

export const method = 'get';
export const path = '/';
export function handler(req: any, rep: any) {
  const current = process.hrtime();

  process.nextTick(() => {
    const diff = process.hrtime(current);
    rep({
      name: pack.name,
      version: pack.version,
      loop: diff[0] * 1e9 + diff[1]
    });
  });
}
