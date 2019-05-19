const viewGenerator = require('../index.js');

const targetText = `
<% ['zhang','li','wang'].map(item=>\`import x from '\${item}'\`) %>
<Router>
<% 5>1 ? '<Route path="123"/>': '' %>
</Route>

`
viewGenerator(targetText);