import * as _glob from 'glob';
import { all, promisify, promisifyAll } from 'bluebird';
import {readFile as _readFile} from 'fs';

const glob = promisify(_glob) as any;
const readFile = promisify(_readFile);
import { create } from 'mem-fs';
import * as fsEditor from 'mem-fs-editor';
import { prompt } from 'inquirer';
import * as crypto from 'crypto';

const base = `${__dirname}/../../../templates`;

export async function readTemplates(editor: any) {
  const filePaths = (await glob(`${base}/**/*`, {nodir: true, dot: true})) as string[];
  const files = await all(filePaths.map((f) => {
    return readFile(f).then(content => {
      return content;
    });
  }));
  filePaths.forEach((f: string, index: number) => {
    editor.write(f, files[index]);
  });

  return filePaths;
}

interface TplOptions {
  mode: string;
  name: string;
  description: string;
  noprompt: boolean;
}

async function confirmPrompt(p_name: string, message: string, def: boolean = false) {
  const responses = await prompt([{
    message,
    name: p_name,
    default: def,
    type: 'confirm'
  }]);

  return responses[p_name];
}

async function applyPromise<O, T>(entries: O[], f: (o: O) => Promise<T>, acc: T[] = []): Promise<T[]> {
  if (entries.length === 0) {
    return acc;
  } else {
    const first = entries.shift() as O;
    const promiseResult = await f(first) as T;
    acc.push(promiseResult);
    return applyPromise(entries, f, acc);
  }
}

interface Log {
  type: string;
  msg: string;
}

export default async function templates({mode, name, description, noprompt}: TplOptions) {
  const store = create();
  const _editor = fsEditor.create(store);
  const editor = promisifyAll(_editor) as any;

  const paths = await readTemplates(editor);
  const logs: Log[] = [{type: 'info', msg: 'Generating templates:'}];
  const pathMap = paths.reduce((acc, p) => {
    const templatePath = p.split('/templates/')[1];
    const category = templatePath.split('/')[0];
    const filePath = p.split(`/templates/${category}/`)[1];
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][filePath] = p;
    return acc;
  }, {});

  const required_templates = Object.assign({}, pathMap['common'], pathMap[mode]);

  const current_path = process.cwd();

  const tplProcessor = async function tplProcessor (tpl: any) {
    let ovewrite = true;
    if (editor.exists(`${current_path}/${tpl}`)) {
      editor.copyTpl(required_templates[tpl], `tmp/${tpl}`, {name, description});
      const existing = editor.read(`${current_path}/${tpl}`);
      const existingHash = crypto.createHash('md5').update(existing).digest('hex');
      const templated = editor.read(`tmp/${tpl}`);
      const templatedHash = crypto.createHash('md5').update(templated).digest('hex');

      if (existingHash === templatedHash) {
        ovewrite = false;
        logs.push({type: 'skip', msg: tpl});
      } else if (!noprompt) {
        ovewrite = await confirmPrompt('confirm_ovewrite', `
          File: "${tpl}" already exists, do you want to ovewrite it?`);
        if (!ovewrite) logs.push({type: 'skip', msg: tpl});
      }
      editor.delete(`tmp/${tpl}`);
    }
    if (ovewrite) {
      logs.push({type: 'new', msg: tpl});
      editor.copyTpl(required_templates[tpl], `${current_path}/${tpl}`, {name, description});
    }
  };

  await applyPromise(Object.keys(required_templates), tplProcessor);

  return {logs, editor};
}
