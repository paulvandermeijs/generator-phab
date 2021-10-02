'use strict';

// @ts-check

const findUp = require('find-up');
const path = require('path');
const _ = require('lodash');
const { realpathSync } = require('fs');

const setBuildRoot = function (env, generator) {
    if (_.isUndefined(env.rootPath)) {
        const { log } = generator;

        const composerPath = findUp.sync('composer.json', {
            cwd: env.cwd
        });

        if (composerPath) {
            log.ok('Found `composer.json`.');

            const rootPath = path.dirname(composerPath);

            if (rootPath !== env.cwd) {
                log.ok('Changing project root to `%s`.', rootPath);

                generator.destinationRoot(rootPath);
            }

            Object.assign(env, {
                rootPath,
                composerPath
            });
        } else {
            Object.assign(env, {
                rootPath: env.cwd
            });
        }
    }

    return env;
};

const readComposer = env => _.isUndefined(env.composer)
    ? Object.assign(env, {
        composer: env.composerPath
            ? require(env.composerPath)
            : {}
    })
    : env;

const buildClassPaths = function (env) {
    if (_.isUndefined(env.classPaths)) {
        const { composer } = env;

        const realpath = (path) => {
            try {
                return realpathSync(path)
            } catch (e) {}

            return path;
        };

        const makePaths = defs => Object
            .entries(defs)
            .reduce(
                (paths, [namespace, path]) => _.isArray(path)
                    ? {
                        ...paths,
                        ...path.reduce(
                            (paths, path) => ({
                                ...paths,
                                [realpath(path)]: namespace
                            }),
                            {}
                        )
                    }
                    : {
                        ...paths,
                        [realpath(path)]: namespace
                    },
                {}
            );

        const classPaths = !_.isUndefined(composer.autoload)
            ? {
                ...makePaths(composer.autoload['psr-0'] || {}),
                ...makePaths(composer.autoload['psr-4'] || {}),
            }
            : {}

        Object.assign(env, {
            classPaths
        });
    }

    return env;
};

const setEditor = (env) => _.isUndefined(env.editor)
    ? Object.assign(env, {
        editor: process.env.EDITOR
    })
    : env;

const builders = [
    setBuildRoot,
    readComposer,
    buildClassPaths,
    setEditor,
];

module.exports = (generator) => builders.reduce((env, build) => build(env, generator), generator.env);
