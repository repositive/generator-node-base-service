
import templates from './templates';

function builder(yargs: any) {
  return yargs
    .usage('Usage: $0 gen [mode] [name] [description]')
    .option('name', {
      describe: 'The name of the generated module',
      default: process.cwd().split('/').pop(),
      type: 'string'
    })
    .option('description', {
      alias: ['desc'],
      describe: 'Short description of what this does',
      type: 'string'
    })
    .option('mode', {
      describe: 'What are you generating?',
      default: 'service',
      choices: ['lib', 'service']
    })
    .argv;
}

function handler(args: any) {
  templates(args).then(({paths, editor}) => {
    Object.keys(paths).forEach(k => {
      console.log(`Creating: ${k}`);
    });
    editor.commitAsync().then(()=> {
      console.log('Done!');
    }).catch(console.error);
  });
}

export default {
  command: 'generate',
  aliases: ['gen'],
  describe: 'Scaffold a new repositive module',
  builder,
  handler
};
