'use strict';

// @ts-check

const Generator = require('../base');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('name', {
            type: String,
            description: 'The name for your callable',
            required: false
        });

        this.options.class = {
            ...this.options.class,
            name: this.options.name
        }
    }
    
    async writing() {
        try {
            this.composeWith(
                require.resolve(`../class`),
                {
                    contextRoot: this.contextRoot,
                    ...this.options,
                    class: {
                        functions: [
                            {
                                visibility: 'public',
                                name: '__invoke',
                                type: 'self',
                                body: 'return $this;'
                            }
                        ]
                    }
                }
            );
        } catch (e) {
            this.error('Something went wrong.');
        }
    }
};
