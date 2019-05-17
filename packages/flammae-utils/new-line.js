/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:33:17
 */


// 针对不同平台判断，不同换行符。这里只匹配了 Windows
// windows \n\r
// unix \n
// mac \r

module.exports = {
    newLine: '\\r\\n|\\n',
    space: '(\u0020| )',
};
