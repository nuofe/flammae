const path = require('path');

module.exports = function traverse(filename) {
    const paths = filename.split(/\\\\|\\|\//);
    const fsMap = this;
    // eslint-disable-next-line no-shadow
    const result = paths.reduce(([subFsMap, result], curFilename) => {
        const statsOrDirent = subFsMap[curFilename];
        result.unshift(statsOrDirent);
        if (statsOrDirent) {
            return [statsOrDirent.children ? statsOrDirent.children : statsOrDirent, result];
        }
        return [subFsMap, result];
    }, [fsMap, []]);
    return result[1];
};
