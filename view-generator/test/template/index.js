const fs = require('fs-extra');
const viewGen = require('../../index');
const templateText = fs.readFileSync('./template.jsx',{encoding: 'utf8'});

const data = [
    {
        _type: 'doc',
        name: 'MD1',
        path: '../MD1'
    },
    {
        _type: 'page',
        name: 'Comp1',
        path: '../Comp1'
    },
    {
        _type: 'style',
        path: '../Style1'
    },
];

console.log(viewGen(templateText, data));