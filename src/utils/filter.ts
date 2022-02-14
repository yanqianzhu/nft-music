import { devUrl } from "@/api/url";
export function dateFormat(timeStamp: number, format: string) {
  if (timeStamp.toString().length !== 13) {
    timeStamp = timeStamp * 1000;
  }
  let ret;
  let date = new Date(timeStamp);
  const opt = {
    "y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "h+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString(), // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(format);
    if (ret) {
      format = format.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return format;
}
export function formatDate(timeStamp: number | string): string {
  let date = new Date(timeStamp);
  var year = date.getFullYear();
  var m = date.getMonth() + 1;
  var day = date.getDate();
  return "" + year + "." + (m < 10 ? "0" + m : m) + "." + (day < 10 ? "0" + day : day);
}
// 将整数转换成 时：分：秒的格式
export function realFormatSecond(second: string | number) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    //@ts-ignore
    let time = parseInt(second);
    var hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    var mimute = Math.floor(time / 60);
    time = time - mimute * 60;
    if (hours == 0) {
      return ("0" + mimute).slice(-2) + ":" + ("0" + time).slice(-2);
    } else {
      return hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + time).slice(-2);
    }
  } else {
    return "0:00:00";
  }
}
//将数字转为没3个又，号
export function toLocalString(num: number): string {
  return num.toLocaleString();
}
// 随机数
export function RandomNumBoth(Min: number, Max: number) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
export function getUrl(url: string) {
  return process.env.NODE_ENV == "development"
    ? `${devUrl.target}/api/v1.0/cloud/auth${url}`
    : `${window.location.origin}/api/v1.0/cloud/auth${url}`;
  // return `${window.location.origin}/api/v1.0/cloud/auth${url}`;
  return `http://172.20.7.37:3100/api/v1.0/cloud/auth${url}`;
}
export function unix(time: any) {
  return new Date(time).getTime() / 1000;
}
export function isLink(link: string): boolean {
  var reg=/^(http|ftp|https)/ig;
  return reg.test(link)
}
