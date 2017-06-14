import { spawn } from 'child_process';

export function gitInit(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const git = spawn('git', ['init']);

    git.stdout.pipe(process.stdout);

    git.stderr.pipe(process.stderr);

    git.on('close', (code) => {
      if (code === 0) {
        return resolve();
      } else {
        return reject();
      }
    });
  });
}
