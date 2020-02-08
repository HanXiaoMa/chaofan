/**
 * @file 加密工具类
 * @date 2019/8/17 10:55
 * @author ZWW
 */
import Forge from 'node-forge';

/**
 * MD5加密
 * @param {String} str
 */
export const md5 = (str) => {
  // 注意创建与更新需要写在一起
  const md5 = Forge.md.md5.create();
  md5.update(str);
  return md5.digest().toHex();
};
