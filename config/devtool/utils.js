'use strict';
const path = require('path');
const fs = require('fs');


// 因为执行npm start的时候是在项目根目录，也就是工作目录是根目录，
// 所以process.cwd()返回的是根目录
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(src) {
    return path.resolve(appDirectory, src)
}

const packageDirectory = path.resolve(__dirname, '../../')
function resolvePackage(src) {
    return path.resolve(packageDirectory, src)
}


function onlyOne(...args) {
    let arr = []
    args.forEach(item=> {
        if(!item || Object.prototype.toString.call(item) !== '[object Array]') return
        arr = arr.concat(item)
    })
    return [...new Set(arr)]
}

// 拷贝
function copy(target, obj) {
    if(!obj) return target
    target = Object.assign({}, target)
    let targetItem;
    let objItem;
    for(let key in obj) {
        targetItem = target[key];
        objItem = obj[key];

        if(typeof objItem !== 'object' || objItem === null) {
            target[key] = objItem;
            continue;
        }
        if(Object.prototype.toString.call(objItem) === '[object Array]') {
            target[key] = onlyOne(targetItem, objItem);
            continue;
        }
       
        target[key] = Object.assign({},targetItem, objItem);
    
    }
    
    return target
}

module.exports = {
    resolveApp,
    resolvePackage,
    onlyOne,
    copy
}
