// 将整数转换成 时：分：秒的格式
export function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);
    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;
    if (hours == 0) {
      return ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
    } else {
      return (
        hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
      );
    }
  } else {
    return "0:00:00";
  }
}

export default realFormatSecond;
