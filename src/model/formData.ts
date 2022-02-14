interface childrenItem {
  label: string;
  types: number;
  valueName: string;
  tipSlotName?: string;
  radioGroup?: string[];
  radioType?: number;
  rows?: number;
  uploadText?: string;
  tips?: string;
  checkLabel?: string;
  hasQuestionMark?: boolean;
  placeholder?: string;
  accept?: string;
}

export interface FormState {
  label: string;
  children?: childrenItem[];
  required?: Boolean;
}
export interface FormData {}
