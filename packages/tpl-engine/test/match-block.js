const { blockReg } = require('../blocks-matcher');

/* eslint-disable */
const str = '<% \n$data.map(item=>(\n    item.name\n    ?`import% ${item.name} from \'${item.path}\';`\n    : `import \'${item.path}\';`\n))\n%>';
const correctResult = ' \n$data.map(item=>(\n    item.name\n    ?`import% ${item.name} from \'${item.path}\';`\n    : `import \'${item.path}\';`\n))\n';
/* eslint-enable */

const result = str.match(new RegExp(blockReg));
console.log(result);
console.log(result && result[1] === correctResult);
