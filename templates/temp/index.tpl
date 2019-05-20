import React from 'react';
import ReactDOM from 'react-dom';
<%
$data.stylePaths.map(path => `import '${path}';`)
%>

import App from './app.jsx';

ReactDOM.render(<App/>, document.querySelector('#root'));
