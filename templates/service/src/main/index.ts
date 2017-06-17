import { Server } from 'hapi';
import { promisify } from 'bluebird';
import routeLoader from '@repositive/hapi-route-loader';

export default async function init() {
  const server = new Server();
  const register: any = promisify(server.register, {context: server});
  const startAPI: any = promisify(server.start, {context: server});

  server.connection({
    port: 3000
  });

  await register({
    register: routeLoader,
    options: {
      match: `${__dirname}/routes/**/*.js`
    }
  });

  await startAPI();

  console.log('API initialized');
}

function start(d: number = 10) {
  return init().catch((err) => {
    console.error(`An error occurred`, err);
    const delay = d > 60 ? 10 : d;
    console.log(`Retrying initalization in ${delay}s`);
    setTimeout(
      () => {
          start(delay * 2);
      },
      delay * 1000
    );
  });
}

start();
