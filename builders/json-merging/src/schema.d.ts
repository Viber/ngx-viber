export interface JsonMergingBuilderSchema {
  targetPath: string;
  targetFilename: string;
  sourceList: Array<string>;
  fileTemplate: RegExp;
  groupByName: boolean;
  nestedDirectories: boolean;
}
