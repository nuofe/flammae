const path = require('path');

module.exports = function normalizeFilename(filename) {
    if (typeof filename !== 'string') {
        throw TypeError(`expects an argument of type string, but got a\\an ${typeof filename}`);
    }

    return path.normalize(filename);
};
