import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router.jsx';
<%
$data.stylePaths.map(path => `import '${path}';`)
%>

ReactDOM.render(<Router/>, document.querySelector('#root'));
