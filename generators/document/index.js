'use strict';

// @ts-check

const Generator = require('../base');
const { normalizeName, createDocument } = require('../../services/php/document');
const { spawn } = require("child_process");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('skip-document', {
            type: Boolean,
            description: 'Use document defaults',
            default: false
        });

        this.option('open', {
            alias: 'o',
            type: Boolean,
            description: 'Open the document in default editor',
            default: false
        });

        this.argument('name', {
            type: String,
            description: 'The name for your document',
            default: 'document',
            required: false
        });
    }

    async prompting() {
        this.options.document = {
            ...this.options.document,
            ...await this._getDocument()
        };
    }

    async _getDocument() {
        return this.options.advanced && !this.options['skip-document']
            ? await this._promptDocument() 
            : {
                author: this.config.get('promptValues').author,
                license: this.config.get('promptValues').license,
                copyright: this.config.get('promptValues').copyright,
            }
    }

    async _promptDocument() {
        return await this.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'What is the description for your document?'
            },
            {
                type: 'input',
                name: 'version',
                message: 'What is the version of your document?',
                default: '1.0.0'
            },
            {
                type: 'input',
                name: 'author',
                message: 'Who is the author of your document?',
                store: true
            },
            {
                type: 'input',
                name: 'license',
                message: 'What is the license for your document?',
                store: true
            },
            {
                type: 'input',
                name: 'copyright',
                message: 'What is the copyright for your document?',
                store: true
            },
        ]);
    }

    async writing() {
        try {
            const document = await createDocument(this.options.document);

            const destination = this.destinationPath(this.options.destination || `${this.contextRoot}/${normalizeName(this.options.name)}.php`)

            this.fs.write(
                destination,
                document
            );

            if (this.options.open && this.env.editor) {
                this.log.info(`Opening ${destination}...`);
                
                spawn(this.env.editor, [destination]);
            }
        } catch (e) {
            this.log.error('Something went wrong');
        }
    }
};
