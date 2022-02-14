interface makeItem {
  label: string;
  value: string;
  canSelect: Boolean;
  required: Boolean;
  canEdit: Boolean;
}
export const defaultItem: makeItem = {
  label: "",
  value: "",
  canSelect: true,
  required: false,
  canEdit: true,
};
export const musciMakeList: makeItem[] = [
  {
    label: "作品名称",
    value: "Name",
    canSelect: false,
    required: true,
    canEdit: false,
  },
  {
    label: "演唱",
    value: "Singing",
    canSelect: false,
    canEdit: false,
    required: true,
  },
  {
    label: "作词",
    value: "WriteLyrics",
    canSelect: false,
    canEdit: false,
    required: true,
  },
  {
    label: "作曲",
    value: "WriteMusic",
    canSelect: false,
    canEdit: false,
    required: true,
  },
  {
    label: "编曲",
    value: "Arranger",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "制作人",
    value: "Producer",
    canSelect: true,
    required: false,
    canEdit: true,
  },
  {
    label: "和声",
    value: "Harmony",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "录音",
    value: "Recording",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "母带",
    value: "OriginalDemo",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "混音",
    value: "Mix",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "后期混缩",
    value: "Confusion",
    canSelect: true,
    canEdit: true,
    required: false,
  },
  {
    label: "监制",
    value: "Production",
    canSelect: true,
    canEdit: true,
    required: false,
  },
];

export const musicType = {
  10041: "歌曲",
  10042: "伴奏",
  10043: "翻唱",
  10044: "Demo",
};
export const musicTypeMap = {
  歌曲: 10041,
  伴奏: 10042,
  翻唱: 10043,
  Demo: 10044,
};
