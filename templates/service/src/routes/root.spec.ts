import * as test from 'tape';
import { Test } from 'tape';
import { stub, spy } from 'sinon';
import * as proxy from 'proxyquire';

const mockPackage = {
  name: 'test',
  version: '1'
};

test('Service Status route', (t: Test) => {

  const status = proxy('./root', {
    '../../package.json': mockPackage
  });

  t.equals(status.method, 'get', 'Method is GET');
  t.equals(status.path, '/', 'The path must me the root');
  t.equals(typeof status.handler, 'function', 'Must expose the handler as a function');

  const resp = spy();

  status.handler(undefined, resp);

  setTimeout(
    () => {
      t.ok(resp.calledOnce, 'The handlers returns stuff');
      const call = resp.getCall(0);
      t.equals(call.args[0].name, mockPackage.name, 'Returns the name of the service');
      t.equals(call.args[0].version, mockPackage.version, 'Returns the version of the service');
      t.ok(Number.isInteger(call.args[0].loop), 'Returns teh loop delay of the service in ns');
      t.end();
    },
    1);
});
