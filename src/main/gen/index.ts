
import * as chalk from 'chalk';
import { prompt } from 'inquirer';
import templates from './templates';
import {gitInit} from './git';
import { installDependencies } from './npm';

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

  async function confirmPrompt(p_name: string, message: string, def: boolean = true) {
    if (!noprompt) {
      const responses = await prompt([{
        message,
        name: p_name,
        default: def,
        type: 'confirm'
      }]);

      debugger;
      if (!responses[p_name]) {
        return Promise.reject(new Error('Cancelled by user'));
      }
    }
  }

  await confirmPrompt('confirm_args', `
  Provided data:
    mode: ${mode}
    name: ${name}
    description: ${description || '<no description>'}

  Continue?
  `);

  const {paths, editor} = await templates(args);

  if (verbose) {
    Object.keys(paths).forEach(k => {
      console.log(`${chalk.green('Creating:')} ${k}`);
    });
  }

  await editor.commitAsync();

  await gitInit();
  console.log(`Installing npm dependencies...`);
  await installDependencies(args);
}

function handler(args: any) {
  _handler(args)
    .then(() => console.log('Done!'))
    .catch((err) => {
      if (err.message) {
        console.error(`${chalk.red('Error: ')} ${err.message}`);
      } else {
        console.error(err);
      }
    });
}

export default {
  command: 'generate',
  aliases: ['gen'],
  describe: 'Scaffold a new repositive module',
  builder,
  handler
};
