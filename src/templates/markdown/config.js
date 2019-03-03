import marked from 'marked'
import './styles/atom-one-light.css'
import './style.css'
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';


hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);

// marked https://marked.js.org
marked.setOptions({
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    gfm: true, // 启用github标准
});

const renderer = new marked.Renderer();

// 重写heading输出规则
// renderer.heading = function (text, level) {
//     var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//     return `
//           <h${level}>
//             <a name="${escapedText}" class="anchor" href="#${escapedText}">
//               <span class="header-link">${text}</span>
//             </a>
//           </h${level}>`;
// };

// renderer.code = function (str, lang, b) {
//     console.log(text, x, b)
//     return text
// };


export default renderer