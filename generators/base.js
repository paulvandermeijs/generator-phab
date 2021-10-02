'use strict';

// @ts-check

const Generator = require('yeoman-generator');
const os = require('os');
const buildEnv = require('../services/build-env');
const prettier = require('gulp-prettier');

const authorsToString = (authors) => authors.map((author) => author.email ? `${author.name} <${author.email}>` : author.name).join(', ');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.env = buildEnv(this);

        this.config.defaults({
            promptValues: {
                author: authorsToString(this.env.composer.authors || []) || os.userInfo().username,
                license: this.env.composer.license || 'ISC',
                copyright: new Date().getFullYear().toString()
            }
        });

        this.option('advanced', {
            type: Boolean,
            description: 'Show advanced options',
            default: false
        });

        this.registerTransformStream(prettier({ tabWidth: 4 }));
    }
}
