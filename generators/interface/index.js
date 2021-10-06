'use strict';

// @ts-check

const Generator = require('../base');
const { create, normalizeName, extractName, nameToPath } = require('../../services/php/interface');
const validator = require('validator');
const { resolve: resolveNamespace } = require('../../services/php/namespace');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('name', {
            type: String,
            description: 'The name for your interface',
            required: false
        });

        this.options.interface = {
            ...this.options.interface,
            name: this.options.name
        }
    }

    async prompting() {
        this.options.interface = {
            ...this.options.interface,
            name: await this._getName(),
            ...await this._getAdvanced()
        };
    }

    async _getName() {
        const name = this.options.interface.name;

        return name
            ? (() => {
                this.log.ok(`Using interface name \`${name}\`.`);

                return name;
            })()
            : (async () => {
                this.log.error(`No interface name provided.`);

                const answers = await this.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is the name for your interface?',
                        validate: (input) => {
                            switch (true) {
                                case validator.isEmpty(input, { ignore_whitespace: true }):
                                    return 'Please provide a name for your interface';
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
            : {}
    }

    async _promptAdvanced() {
        return await this.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'What is the description for your interface?'
            }
        ]);
    }

    async writing() {
        const name = normalizeName(this.options.interface.name);

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
                        body: await create(this.options.interface),
                        namespace
                    }
                }
            );
        } catch (e) {
            this.log.error('Something went wrong.');
        }
    }
};
