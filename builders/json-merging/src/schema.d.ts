export interface JsonMergingBuilderSchema {
  targetPath: string;
  targetFilename: string;
  sourceList: Array<string>;
  filenameTemplate: RegExp;
  groupByFilename: boolean;
  deepSearch: boolean;
}
