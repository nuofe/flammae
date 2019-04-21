// 将路径转换成js可以加载的路径
// D:\flammae\root\src =>  D:/flammae/root/src
export const resolvePath = function (p) {
    return p.split(path.sep).join('/')
};