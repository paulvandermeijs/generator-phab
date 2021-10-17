'use strict';

// @ts-check

const ejs = require('ejs');
const { normalizeName, extractName, createComment } = require('./interface');
const { parse } = require('./type');

const evalType = (data, tag, name) => {
    const { type, phpdoc } = parse(data.type, tag, name);

    return {
        ...data,
        type,
        comment: {
            ...(data.comment || {}),
            lines: [
                ...(data.comment && data.comment.lines || []),
                ...(phpdoc ? [phpdoc] : []),
            ],
        },
    };
};

const evalParameterTypes = (data) => {
    data.parameters = (data.parameters || []).map(parameter => {
        const { type, phpdoc } = parse(parameter.type, 'param', parameter.name);

        data.comment = {
            ...(data.comment || {}),
            lines: [
                ...(data.comment && data.comment.lines || []),
                ...(phpdoc ? [phpdoc] : []),
            ],
        };

        return { ...parameter, type };
    });

    return data;
};

/**
 * @param {object} data
 */
const create = async (data) => {
    const { name } = extractName(normalizeName(data.name));

    return await ejs.renderFile(
        `${__dirname}/../../templates/php/class.ejs`,
        {
            ...data,
            name,
            comment: createComment(data.description),
            properties: (data.properties || []).map(property => evalType(property)),
            functions: (data.functions || []).map(fun => evalType(evalParameterTypes(fun), 'return')),
        }
    );
};

module.exports = {
    create
}
