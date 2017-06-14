
declare namespace npm_programatic {

  interface Options {
    save?: boolean;
    saveDev?: boolean;
    global?: boolean;
    cwd?: string;
    output?: boolean;
  }

  export function install(packages: string[], options?: Options): void;
  export function uninstall(packages: string[], options?: Options): void;
}


declare module 'npm-programmatic' {
  export = npm_programatic;
}
