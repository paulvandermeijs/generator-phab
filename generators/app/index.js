'use strict';

// @ts-check

var Generator = require('yeoman-generator');
var chalk = require('chalk');

module.exports = class extends Generator {
    async prompting() {
        this.log('');
        this.log(chalk.bold(chalk.magenta(this._title())));
        this.log('');
        this.log(chalk.bold(`PHAB version ${this.rootGeneratorVersion()}, copyright (c) 2018 – ${new Date().getFullYear().toString()}, Paul van der Meijs`));
        this.log('');
    }

    /**
     * @return {string}
     */
    _title() {
        return this.fs.read(this.templatePath('title.txt'));
    }
};
