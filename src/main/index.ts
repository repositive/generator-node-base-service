#!/usr/local/bin/node

import * as yargs from 'yargs';
import generate from './gen';

yargs
  .strict()
  .demandCommand(1, 1, 'You need to specify a command', 'You can\'t specify more than a single command')
  .version()
  .help()
  .alias('help', 'h')
  .usage('Usage:\n  $0 <cmd>')
  .command(generate)
  .option('noprompt', {
    alias: ['y'],
    describe: 'Do not ask for confirmation',
    default: false,
    type: 'boolean'
  })
  .option('verbose', {
    alias: ['v'],
    describe: 'Verbose mode',
    default: false,
    type: 'boolean'
  })
  .argv;

