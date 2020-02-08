/**
 * @file 排序工具类
 * @date 2019/8/17 10:50
 * @author ZWW
 */
/**
 * 对象排序,并将key-value值以key=value&的格式拼接成字符串
 * @param {Object} obj
 */
export const sortObj = (obj) => {
  const objKey = Object.keys(obj);
  const _objKeyArray = objKey.sort((a, b) => b.localeCompare(a));
  let sToken = '';
  for (let i = 0; i < _objKeyArray.length; i++) {
    sToken += `${_objKeyArray[i]}=${obj[_objKeyArray[i]]}&`;
  }
  return `${sToken}*********`.replace(/[!|*|\\|(|)]/g, ''); // *********为加密的密钥
};
