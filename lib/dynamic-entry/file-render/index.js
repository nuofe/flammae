'use strict';

const render = require('./render');
const FileRender = require('./file-render');

FileRender.render = render;

module.exports = FileRender;
