'use strict';

// @ts-check

const ejs = require('ejs');

/**
 * @param {Record<string, string>} document 
 */
const createDocComment = (document) => {
    const lines = [
        ...(document.description ? [document.description] : []),
        ...(document.version ? [`@version ${document.version}`] : []),
        ...(document.author ? [`@author ${document.author}`] : []),
        ...(document.license ? [`@license ${document.license}`] : []),
        ...(document.copyright ? [`@copyright ${document.copyright}`] : []),
    ];

    return lines.length ? { lines } : null;
};

const createDocument = async (data) => {
    const { namespace, body } = data;

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
            body
        }
    );
};

module.exports = {
    createDocument
};
