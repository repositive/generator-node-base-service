
declare namespace mem_fs_editor {

  type Store = any;

  interface FsEditor {
    read(path: string, options?: {raw?: boolean, defaults?: string}): string;
    write(path: string, content: string | Buffer): void;
    readJSON(path: string, defaults?: any): any;
    writeJSON(path: string, contents: any, replacer?: any, space?: number): void;
    append(path: string, contents: string, options?: {trimEnd?: boolean, separator?: string}): void;
    extendJSON(path: string, contents: any, replacer?: any, space?: number): void;
    delete(path: string, options?:{globOptions?: any}): void;
    copy(from: string, to: string, options?: {process?: (contents: Buffer) => Buffer | string, globOptions?: any}): void;
    copyTpl(from: string, to: string, context: any): void;
    move(from: string, to: string, options?:{globOptions?: any}): void;
    exists(path: string): boolean;
    commit(callback: () => void): void;
  }

  export function create(store: Store): FsEditor;
}

declare module  'mem-fs-editor' {
  export = mem_fs_editor;
}
