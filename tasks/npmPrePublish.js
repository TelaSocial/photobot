import { cd, cp, test, rm } from 'shelljs';

cd('dist/npm');

// files not created by babel that we want to include in the npm package
// by copying from ../../
const rootFilesToCopy = [
    '../../package.json',
    '../../README.md',
    '../../CONTRIBUTING.md',
    '../../LICENSE',
    '../../AUTHORS'
];
// files created by babel that we want to remove from the npm package
const rootFilesToRemove = [
    'config.js'
];
rootFilesToCopy.forEach(filename => {
    if (test('-f', filename)) { cp(filename, '.'); }
});
rootFilesToRemove.forEach(filename => {
    if (test('-f', filename)) { rm(filename); }
});
