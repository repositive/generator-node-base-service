import * as yargs from 'yargs';
import generate from './gen';

let linterGod = yargs
  .strict()
  .demandCommand(1, 1, 'You need to specify a command', 'You can\'t specify more than a single command')
  .version()
  .help()
  .alias('help', 'h')
  .usage('Usage:\n  rps <cmd>')
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

linterGod = linterGod;
