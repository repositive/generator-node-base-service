const pack = require('../../../package.json');

export const method = 'get';
export const path = '/';


export function handler(req: any, rep: any) {
  rep(pack);
}
