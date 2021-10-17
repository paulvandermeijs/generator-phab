'use strict';

// @ts-check

const getNativeType = type => {
    switch (true) {
        case null !== type.match(/\[\]$/):
            return 'iterable';

        case null !== type.match(/^array\W/i):
            return 'array'

        case null !== type.match(/^(callable|Closure)\W/i):
            return 'callable'
    }
}

const parse = (type, tag = 'var', name = '') => (type || '').match(/[^\w\\]/)
    ? { type: getNativeType(type), phpdoc: `@${tag} ${type} ${name}`.trim()}
    : { type };

module.exports = {
    parse
};
