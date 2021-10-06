'use strict';

// @ts-check

const Generator = require('../base');
const { normalizeName, extractName, nameToPath } = require('../../services/php/interface');
const { create } = require('../../services/php/class');
const validator = require('validator');
const { resolve: resolveNamespace } = require('../../services/php/namespace');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('name', {
            type: String,
            description: 'The name for your class',
            required: false
        });

        this.option('abstract', {
            type: Boolean,
            description: 'Whether or not this class is abstract',
            default: false
        });

        this.option('final', {
            type: Boolean,
            description: 'Whether or not this class is final',
            default: false
        });

        this.options.class = {
            ...this.options.class,
            name: this.options.name,
            abstract: this.options.abstract,
            final: this.options.final
        }
    }

    async prompting() {
        this.options.class = {
            ...this.options.class,
            name: await this._getName(),
            ...await this._getAdvanced()
        };
    }

    async _getName() {
        const name = this.options.class.name;

        return name
            ? (() => {
                this.log.ok(`Using class name \`${name}\`.`);

                return name;
            })()
            : (async () => {
                this.log.error(`No class name provided.`);

                const answers = await this.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is the name for your class?',
                        validate: (input) => {
                            switch (true) {
                                case validator.isEmpty(input, { ignore_whitespace: true }):
                                    return 'Please provide a name for your class';
                            }
        
                            return true;
                        }
                    }
                ]);

                return answers.name;
            })();
    }

    async _getAdvanced() {
        return this.options.advanced 
            ? await this._promptAdvanced() 
            : {
                abstract: this.options.abstract,
                final: this.options.final
            }
    }

    async _promptAdvanced() {
        return await this.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'What is the description for your class?'
            },
            {
                type: 'confirm',
                name: 'abstract',
                message: 'Is your class abstract?',
                default: this.options.class.abstract
            },
            {
                type: 'confirm',
                name: 'final',
                message: 'Is your class final?',
                default: this.options.class.final,
                when: (answers) => !answers.abstract
            }
        ]);
    }

    async writing() {
        const name = normalizeName(this.options.class.name);

        const destination = `${this.options.contextRoot || this.contextRoot}/${nameToPath(name)}.php`;

        const { namespace } = extractName(resolveNamespace(this.env.classPaths, destination) || name);

        try {
            this.composeWith(
                require.resolve(`../document`),
                {
                    ...this.options,
                    destination,
                    document: {
                        ...this.options.document,
                        body: await create(this.options.class),
                        namespace
                    }
                }
            );
        } catch (e) {
            this.log.error('Something went wrong.');
        }
    }
};
