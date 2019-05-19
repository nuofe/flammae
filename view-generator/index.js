// TODO: 有问题
const evalBlockRegText = `<%(.*|\n|\r\n)%>`;

module.exports = function viewGenerator(targetText, data) {
    const matchedBlocks = targetText.match(new RegExp(evalBlockRegText, 'gm'));
    if (!matchedBlocks) {
        return targetText;
    }
    // TODO: 优化，只用replace就可以
    return matchedBlocks.reduce((text, blockText) => {
        const codeText = blockText.match(new RegExp(evalBlockRegText))[1];
        const blockExcutedResult = excuteCode(codeText, data);
        const newText = text.replace(blockText, blockExcutedResult);
        return newText;
    }, targetText);
};

function excuteCode(blockText, data) {
    const result = eval(`(($data)=>${blockText})(${JSON.stringify(data)})`);
    const resultType = typeof result;
    if (!result) {
        return '';
    }
    if (resultType === 'string') {
        return result;
    }
    if (Array.isArray(result)) {
        return result.join('\n');
    }
    return result;
}

