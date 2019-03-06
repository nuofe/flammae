var x = ':::
\`\`\`jsx
    function Demo() {
        return (
            <React.Fragment>
                <Button type='primary'>主按钮</Button>
                <Button>次按钮</Button>
                <Button type='dashed'>虚框按钮</Button>
                <Button type='danger'>危险按钮</Button>
            </React.Fragment>
        )
    }
    \`\`\`
    :::`
var newLine = '\n|\r|\r\n'
x.match(/\:\:\:(.|\n|\r)*\:\:\:/)
console.log(RegExp.$1)
console.log(RegExp.$2)
console.log(RegExp.$3)
console.log(RegExp.$4)