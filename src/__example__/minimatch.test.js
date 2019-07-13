const minimatch = require('minimatch');

// x                                                /.theme/pages/*.jsx
console.log(minimatch('/.theme/pages/index.jsx', '/.theme/pages/*/**/index.jsx'));

