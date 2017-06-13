#!/usr/local/bin/node

import templates from './templates';
import * as yargs from 'yargs';

const args = yargs
  .strict()
  .demandCommand(1, 1, 'You need to specify a command', 'You can\'t specify more than a single command')
  .version()
  .help()
  .alias('help', 'h')
  .usage('Usage:\n  $0 <cmd> [noprompt] [args]')
  .command({
    command: 'generate [mode] [name] [description] [lib]',
    aliases: ['gen'],
    describe: 'Scaffold a new repositive module',
    handler(argv: any) {
      console.log(argv);
    }
    // description: 'Scaffold a Repositive project'
  })
  .option('noprompt', {
    alias: ['y'],
    describe: 'Do not ask for confirmation',
    default: false,
    type: 'boolean'
  })
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
  .command({
    command: 'show_templates',
    describe: 'Show the list of templates',
    handler(arg: any) {
      templates(arg)
        .then(({paths, editor}) => {
          return editor.commitAsync();
        })
        .then(() => {
          console.log('Files generated');
        })
        .catch(console.error);
    }
  })
  .argv;

//templates().then(({editor, paths}) => {
//  console.log(editor.read(paths[0]));
//}).catch(console.error);
