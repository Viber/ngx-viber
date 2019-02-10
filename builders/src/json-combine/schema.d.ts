export interface JsonSource {
  source: string;
  filter: string;
}

export interface JsonCombineBuilderSchema {
  targetPath: string;
  targetFilename: string;
  targetFilenameTemplate: string;
  sourceList: Array<string | JsonSource>;
  filenameTemplate: RegExp;
  groupByFilename: boolean;
  deepSearch: boolean;
}
