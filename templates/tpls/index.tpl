import React from 'react';
import ReactDOM from 'react-dom';
<%
`import App from '${$data.appFilePath}';`
%>
<%
$data.stylePaths.map(path => `import '${path}';`)
%>

ReactDOM.render(<App/>, document.querySelector('#root'));
