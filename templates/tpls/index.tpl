import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes.jsx';
<%
$data.stylePaths.map(path => `import '${path}';`)
%>

ReactDOM.render(<Routes/>, document.querySelector('#root'));
