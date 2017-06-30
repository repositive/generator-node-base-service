import * as _glob from 'glob';
import { all, promisify, promisifyAll } from 'bluebird';
import {readFile as _readFile} from 'fs';

const glob = promisify(_glob) as any;
const readFile = promisify(_readFile);
import { create } from 'mem-fs';
import * as fsEditor from 'mem-fs-editor';
import { prompt } from 'inquirer';

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

export default async function templates({mode, name, description}: TplOptions) {
  const store = create();
  const _editor = fsEditor.create(store);
  const editor = promisifyAll(_editor) as any;

  const paths = await readTemplates(editor);

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
      ovewrite = await confirmPrompt('confirm_ovewrite', `
        File: "${tpl}" already exists, do you want to ovewrite it?`);
    }
    if (ovewrite) editor.copyTpl(required_templates[tpl], `${current_path}/${tpl}`, {name, description});
  };

  await applyPromise(Object.keys(required_templates), tplProcessor);

  return {paths: required_templates, editor};
}
