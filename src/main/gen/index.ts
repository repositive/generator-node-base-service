
import { prompt } from 'inquirer';
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

async function _handler(args: any): Promise<void> {

  const {noprompt, verbose, mode, name, description} = args;

  if (!noprompt) {
    const responses = await prompt([
      {
        type : 'confirm',
        name: 'valid_args',
        default: true,
        message: `
  Provided data:
    mode: ${mode}
    name: ${name}
    description: ${description || '<no description>'}

  Continue?
        `
      }
    ]);

    if (!responses.valid_args) {
      return Promise.reject('Canceled by user');
    }
  }

  const {paths, editor} = await templates(args);

  if (verbose) {
    Object.keys(paths).forEach(k => {
      console.log(`Creating: ${k}`);
    });
  }

  await editor.commitAsync();
}

function handler(args: any) {
  _handler(args)
    .then(() => console.log('Done!'))
    .catch(console.error);
}

export default {
  command: 'generate',
  aliases: ['gen'],
  describe: 'Scaffold a new repositive module',
  builder,
  handler
};
