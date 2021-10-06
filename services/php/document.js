'use strict';

// @ts-check

const ejs = require('ejs');
const { paramCase } = require('change-case');

/**
 * @param {string} name
 */
const normalizeName = (name) => name.split(/[^ a-zA-Z0-9_\x80-\xff]+/).map(paramCase).join('\/');

/**
 * @param {Record<string, string>} document 
 */
const createDocComment = (document) => {
    const lines = [
        ...(document.description ? [document.description] : []),
        ...(document.package ? [`@package ${document.package}`] : []),
        ...(document.version ? [`@version ${document.version}`] : []),
        ...(document.author ? [`@author ${document.author}`] : []),
        ...(document.license ? [`@license ${document.license}`] : []),
        ...(document.copyright ? [`@copyright ${document.copyright}`] : []),
    ];

    return lines.length ? { lines } : null;
};

const createDocument = async (data) => {
    const { namespace, imports, body } = data;

    return await ejs.renderFile(
        `${__dirname}/../../templates/php.ejs`,
        {
            comment: createDocComment(data),
            declares: [
                {
                    key: 'strict_types',
                    value: '1'
                }
            ],
            namespace,
            imports,
            body
        }
    );
};

module.exports = {
    normalizeName,
    createDocument
};
