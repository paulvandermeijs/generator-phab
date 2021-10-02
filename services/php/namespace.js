const pathToName = path => path.replace(/\//g, '\\');

const trim = namespace => namespace.replace(/^\\+|\\+$/g, '');

const resolve = (classPaths, path) => Object
    .entries(classPaths)
    .sort(([, a], [, b]) => b.length - a.length)
    .reduce(
        (matched, [p, namespace]) => matched || (path.startsWith(p) ? `${namespace}${trim(pathToName(path.replace(p, '')))}` : ''),
        ''
    );

module.exports = {
    resolve,
    trim,
};
