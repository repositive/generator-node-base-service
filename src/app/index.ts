import * as Generator from 'yeoman-generator';

class AppGen extends Generator {
  private name: string;

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Service name',
        default: this.appname // Defaults to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        default: ''
      }
    ])
      .then((answers) => {
        this.name = answers.name.split(' ').join('');
        this.description = answers.description;
        this.log(`App Name: ${answers.name}`);
      });
  }

  writing() {
    const basePath = `${__dirname}/../../templates`;

    this.fs.copyTpl(
      `${basePath}/package.json`,
      this.destinationPath('package.json'),
      {name: this.name, description: this.description}
    );

    this.fs.copyTpl(
      `${basePath}/circle.yml`,
      this.destinationPath('circle.yml'),
      {name: this.name}
    );

    this.fs.copyTpl(
      `${basePath}/docker-compose.yml`,
      this.destinationPath('docker-compose.yml'),
      {name: this.name}
    );

    this.fs.copy(
      this.templatePath(`${basePath}/src/main/index.ts`),
      this.destinationPath('src/main/index.ts'),
      {}
    );

    this.fs.copy(
      this.templatePath(`${basePath}/src/test/index.spec.ts`),
      this.destinationPath('src/test/index.spec.ts'),
      {}
    );

    this.fs.copy(
      this.templatePath(`${basePath}/tsconfig.json`),
      this.destinationPath('tsconfig.json'),
      {}
    );

    this.fs.copy(
      this.templatePath(`${basePath}/tslint.json`),
      this.destinationPath('tslint.json')
    );

    this.fs.copy(
      this.templatePath(`${basePath}/gitignore`),
      this.destinationPath('.gitignore')
    );
  }

  install() {
    this.npmInstall([
      'typescript',
      'tslint',
      '@types/node',
      'tape',
      'tap-spec',
      '@types/tape',
      'nyc',
      '@repositive/typescript',
      'nodemon',
      'husky'
    ], {'save-dev': true});
  }

  git() {
    this.spawnCommand('git', ['init']);
  }
}

module.exports = AppGen;
