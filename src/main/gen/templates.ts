
import * as _glob from 'glob';
import { all, promisify, promisifyAll } from 'bluebird';
import {readFile as _readFile} from 'fs';

const glob = promisify(_glob) as any;
const readFile = promisify(_readFile);
import { create } from 'mem-fs';
import * as fsEditor from 'mem-fs-editor';

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

  Object.keys(required_templates).forEach(tpl => {
    editor.copyTpl(required_templates[tpl], `${current_path}/${tpl}`, {name, description});
  });

  return {paths: required_templates, editor};
}
