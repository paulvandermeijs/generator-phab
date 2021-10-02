'use strict';

// @ts-check

const ejs = require('ejs');
const { pascalCase } = require('change-case');

/**
 * @param {string} name
 */
const normalizeName = (name) => name.split(/[^ a-zA-Z0-9_\x80-\xff]+/).map(pascalCase).join('\\').replace(/^\\+|\\+$/g, '');

/**
 * @param {string} name
 */
const extractName = (name) => {
    const lastIndex = name.lastIndexOf('\\');

    return !!~lastIndex 
        ? { namespace: name.substr(0, lastIndex), name: name.substr(lastIndex + 1)} 
        : { name };
};

/**
 * @param {string} name
 */
const nameToPath = (name) => name.replace(/\\/g, '/');

/**
 * @param {string} description 
 */
const createComment = (description) => description 
    ? {lines: [description]} 
    : null

/**
 * @param {object} data
 */
const create = async (data) => {
    const { name } = extractName(normalizeName(data.name));

    return await ejs.renderFile(
        `${__dirname}/../../templates/php/interface.ejs`,
        {
            ...data,
            name,
            comment: createComment(data.description)
        }
    );
};

module.exports = {
    create,
    createComment,
    normalizeName,
    extractName,
    nameToPath
}
