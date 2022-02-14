/**
 * 生成一个用不重复的ID
 * @param { Number } randomLength
 */
 export function getUuiD(randomLength) {
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36);
}

/**
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|\/\/)/.test(path);
}

/**
 * @description 校验密码
 * @param value
 * @returns {boolean}
 */
export function isPassword(value) {
  if (value.length < 8) return false;
  const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#￥%&*.])[a-zA-Z0-9!@#￥%&*.]*$/;
  return reg.test(value);
}

/**
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  const reg = /^[0-9]*$/;
  return reg.test(value);
}

/**
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  return reg.test(value);
}

/**
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

/**
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @description 判断是否是小写字母
 * @param value
 * @returns {boolean}
 */
export function isLowerCase(value) {
  const reg = /^[a-z]+$/;
  return reg.test(value);
}

/**
 * @description 判断是否是大写字母
 * @param value
 * @returns {boolean}
 */
export function isUpperCase(value) {
  const reg = /^[A-Z]+$/;
  return reg.test(value);
}

/**
 * @description 判断是否是大写字母开头
 * @param value
 * @returns {boolean}
 */
export function isAlphabets(value) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(value);
}

/**
 * @description 判断是否是字符串
 * @param value
 * @returns {boolean}
 */
export function isString(value) {
  return typeof value === "string" || value instanceof String;
}

/**
 * @description 判断是否是数组
 * @param arg
 */
export function isArray(arg) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

/**
 * @description 判断是否是端口号
 * @param value
 * @returns {boolean}
 */
export function isPort(value) {
  const reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
  return reg.test(value);
}

/**
 * @description 判断是否是手机号
 * @param value
 * @returns {boolean}
 */
export function isPhone(value) {
  const reg = /^1\d{10}$/;
  return reg.test(value);
}

/**
 * @description 判断是否是身份证号(第二代)
 * @param value
 * @returns {boolean}
 */
export function isIdCard(value) {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(value);
}

/**
 * @description 判断是否是邮箱
 * @param value
 * @returns {boolean}
 */
export function isEmail(value) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(value);
}

/**
 * @description 判断是否中文
 * @param value
 * @returns {boolean}
 */
export function isChina(value) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/;
  return reg.test(value);
}

/**
 * @description 判断是否为空
 * @param value
 * @returns {boolean}
 */
export function isBlank(value) {
  return value === null || false || value === "" || value.trim() === "" || value.toLocaleLowerCase().trim() === "null";
}

/**
 * @description 判断是否为固话
 * @param value
 * @returns {boolean}
 */
export function isTel(value) {
  const reg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})([- ])?)?([0-9]{7,8})(([- 转])*([0-9]{1,4}))?$/;
  return reg.test(value);
}

/**
 * @description 判断是否为数字且最多两位小数
 * @param value
 * @returns {boolean}
 */
export function isNum(value) {
  const reg = /^\d+(\.\d{1,2})?$/;
  return reg.test(value);
}

/**
 * @description 判断是否为json
 * @param value
 * @returns {boolean}
 */
export function isJson(value) {
  if (typeof value === "string") {
    const obj = JSON.parse(value);
    return !!(typeof obj === "object" && obj);
  }
  return false;
}

/**
 * @description 判断是否为特殊字符
 * @param value
 * @returns {boolean}
 */
export function isSpecialCharacters(value) {
  const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
  return reg.test(value);
}

/**
 * @description 判断是否大小写字母和数字
 * @param value
 * @returns {boolean}
 */
export function isAccount(value) {
  if (!value || value.length === 0) return false;
  // const reg1 = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{2,}$/
  const reg1 = /.*[A-Z]+.*/;
  const reg2 = /.*[a-z]+.*/;
  const checkEmail = isEmail(value);
  const reg = /[`~!#$%^&*()_\-+=<>?:"{}|,/;'\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
  return (reg1.test(value) || reg2.test(value) || checkEmail) && !reg.test(value) && !isChina(value);
}

/**
 * @description 判断是否为账号
 * @param value
 * @returns {boolean}
 */
// export function isAccount(value) {
// const reg1 = /^(?=.*?[A-Za-z]+)(?=.*?[0-9]+)(?=.*?[A-Z]).*$/
//   if (!value || value.length === 0) return false
//   const reg = /[`~!@#$%^&*\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im
//   return !reg.test(value)
// }

/**
 * @description 判断是否大小写字母和数字
 * @param value
 * @returns {boolean}
 */
export function isAddrSection(value) {
  if (!value || value.length === 0) return false;
  const ipArr = value.split("/");
  if (ipArr.length !== 2) return false;
  const sec = parseInt(ipArr[1]);
  return isIP(ipArr[0]) && isNumber(ipArr[1]) && sec >= 0 && sec <= 255;
}

/**
 * 检测版本号是否正确
 * @param {string} str
 * @returns {boolean}
 */
export function validVer(str) {
  const num = str.split(".");
  if (num.length !== 3) {
    return false;
  }
  let isTrue = true;
  for (const item of num) {
    if (!isNumber(item)) {
      isTrue = false;
      break;
    }
  }
  return isTrue;
}

export function IsCard(str) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(str);
}
export const IsTime = (time) => {
  var bagin_r = time.match(/^(\d{4})(.)(\d{2})(.)(\d{2})$/);
  return bagin_r !== null
}
