// import * as VinylFile from 'vinyl';
//import {EventEmitter} from 'events';

declare namespace mem_fs {

  type VinylFile = any;

  interface Store {
    get(path: string): VinylFile;
    add(file: VinylFile): void;
    each(callback: (file: string, index: number) => void): void;
  }

  export function create(): Store;
}


declare module  'mem-fs' {
  export = mem_fs;
}
