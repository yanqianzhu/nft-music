/**
 * @description 解析歌词
 * @param text
 * @returns [{content:string}]
 */
export function onFormatLyric(text: string) {
  if (text === undefined) return;
  let lyricArr = text.split(/\n|\r/g);
  let result = []; //新建一个数组存放最后结果
  //遍历分割后的歌词数组，将格式化后的时间节点，歌词填充到result数组
  for (let i = 0; i < lyricArr.length; i++) {
    try {
      let playTimeArr = lyricArr[i].match(/\[\d{2}:\d{2}((\.|\\:)\d{2})\]/g); //正则匹配播放时间
      let lineLyric: Array<string> | String = [];
      if (lyricArr[i].split(playTimeArr).length > 0) {
        lineLyric = lyricArr[i].split(playTimeArr);
      }
      if (playTimeArr != null) {
        for (let j = 0; j < playTimeArr.length; j++) {
          let time = playTimeArr[j].substring(1, playTimeArr[j].indexOf("]")).split(":");
          if (String(lineLyric).substr(1).trim() == "") {
            continue;
          }
          result.push({
            time: (parseInt(time[0]) * 60 + parseFloat(time[1])).toFixed(4),
            content: String(lineLyric).substr(1),
          });
          if (j == playTimeArr.length) {
            result.push({
              time: (parseInt(time[0]) * 60 + parseFloat(time[1]) + 3).toFixed(4),
              content: "",
            });
          }
        }
      }
    } catch (error) {
      continue;
    }
  }
  return result;
}
