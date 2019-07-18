const {
    appTempIndex,
} = require('../paths');
const FileRender = require('./file-render');
const DynamicEntryRender = require('./dynamic-entry-render');

module.exports = function createDynamicEntry() {
    FileRender.render(DynamicEntryRender);
    return appTempIndex;
};
