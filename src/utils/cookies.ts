//写入cookies
// export function setCookie(name: string, value: string) {
//   document.cookie = name + "=" + value;
// }
// export function getCookie(name: string) {
//   var arr,
//     reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//   if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
//   else return null;
// }
export function delCookie(name: string) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  //获取cookie是否存在
  var value = getCookie(name);
  if (value != null) {
    document.cookie = name + "=" + value + ";expires=" + exp.toUTCString();
  }
}
export function setCookie(name: string, value: string) {
  document.cookie = name + "=" + value;
}
export function getCookie(name: string) {
  //获取当前所有cookie
  var strCookies = document.cookie;
  //截取变成cookie数组
  var array = strCookies.split(";");
  //循环每个cookie
  for (var i = 0; i < array.length; i++) {
    //将cookie截取成两部分
    var item = array[i].split("=");
    //判断cookie的name 是否相等
    if (item[0] == name) {
      return item[1];
    }
  }
  return null;
}
