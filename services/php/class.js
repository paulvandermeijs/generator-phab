'use strict';

// @ts-check

const ejs = require('ejs');
const { normalizeName, extractName, createComment } = require('./interface');

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
            comment: createComment(data.description)
        }
    );
};

module.exports = {
    create
}
