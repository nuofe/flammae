const fs = require('fs-extra');
const { matchBlocks } = require('../blocks-matcher');

const templateText = fs.readFileSync('./template/one.tpl', { encoding: 'utf8' });
console.log(matchBlocks(templateText));
