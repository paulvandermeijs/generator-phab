'use strict';

// @ts-check

var Generator = require('yeoman-generator');
var chalk = require('chalk');
const prettier = require('gulp-prettier');

module.exports = class extends Generator {
    async prompting() {
        this.log('');
        this.log(chalk.bold(chalk.magenta(this._title())));
        this.log('');
        this.log(chalk.bold(`PHAB version ${this.rootGeneratorVersion()}, copyright (c) 2018 – ${new Date().getFullYear().toString()}, Paul van der Meijs`));
        this.log('');

        const answers = await this.prompt([
            {
                type: 'list',
                name: 'generator',
                message: 'What would you like to do?',
                choices: [
                    {
                        name: 'Create a class',
                        value: 'class',
                    },
                    {
                        name: 'Create an interface',
                        value: 'interface',
                    },
                    {
                        name: 'Create a callable',
                        value: 'callable',
                    },
                    {
                        name: 'Create a document',
                        value: 'document',
                    },
                ]
            }
        ]);

        this.registerTransformStream(prettier({ tabWidth: 4 }));

        this.composeWith(
            require.resolve(`../${answers.generator}`),
            {
                advanced: true,
                contextRoot: this.contextRoot,
            }
        );
    }

    /**
     * @return {string}
     */
    _title() {
        return this.fs.read(this.templatePath('title.txt'));
    }
};
