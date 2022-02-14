function validate(value: any, callback: Function, name: string, maxLength = 30) {
  if (value === "") {
    callback(new Error(`请输入${name}`));
  } else if ((value as string).length > maxLength) {
    callback(new Error(`最多允许输入${maxLength}个字符，${name}不能包含*￥%#<>等特殊字符`));
  } else if (checkQuote(value as string)) {
    callback(new Error(`最多允许输入${maxLength}个字符，${name}不能包含*￥%#<>等特殊字符`));
  } else {
    callback();
  }
}
function SelectValidate(value: any, callback: Function, name: string) {
  if (value.length === 0) {
    callback(new Error(`请至少选择一种歌曲${name}`));
  } else {
    callback();
  }
}
// 歌曲名称
export const Name = (rule: Object, value: any, callback: Function) => {
  validate(value, callback, "歌曲名称", 50);
};
// 演唱者
export const Singing = (rule: Object, value: any, callback: Function) => {
  validate(value, callback, "演唱者", 50);
};
// 作词
export const WriteLyrics = (rule: Object, value: any, callback: Function) => {
  validate(value, callback, "作词", 50);
};
// 作曲
export const WriteMusic = (rule: Object, value: any, callback: Function) => {
  validate(value, callback, "作词", 50);
};
// 语种
export const Language = (rule: Object, value: Array<string>, callback: Function) => {
  SelectValidate(value, callback, "语种");
};
// 曲风
export const Genre = (rule: Object, value: Array<string>, callback: Function) => {
  SelectValidate(value, callback, "曲风");
};
// 心情
export const Mood = (rule: Object, value: Array<string>, callback: Function) => {
  SelectValidate(value, callback, "心情");
};
// 作品类型
export const WorkType = (rule: Object, value: string, callback: Function) => {
  console.log(value);
  SelectValidate(value, callback, "作品类型");
};
// 作品简介
export const inspiration = (rule: Object, value: any, callback: Function) => {
  validate(value, callback, "作品简介", 1000);
};
// 歌曲版权
export const musicCopyRight = (rule: Object, value: number, callback: Function) => {
  if (typeof value === "number") {
    callback(new Error("请输入数字"));
  }
  if (value <= 0 || value > 100) {
    callback(new Error("请输入 0-100 范围区间的版权比例"));
  }
  callback();
};
// 违规字符
function checkQuote(str: string) {
  // var items = new Array<String>("~", "`", "!", "@", "#", "$", "%", "^", "&", "", "{", "}", "[", "]", "(", ")");
  // items.push(":", ";", "'", "|", '\', "<", ">", "?", "/", "<<", ">>", '||', '//');
  let items = new Array<string>("*", "￥", "%", "#", "<", ">");
  items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
  items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
  str = str.toLowerCase();
  for (var i = 0; i < items.length; i++) {
    if (str.indexOf(items[i]) >= 0) {
      return true;
    }
  }
  return false;
}
