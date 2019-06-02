export interface ChunkInterface {
  top: number;
  bottom: number;
  height: number;
  elements?: Array<ElementInterface>;
}

export interface ElementInterface {
  parent: any;
  bounding: any;
}

export class Chunk implements ChunkInterface {
  height: number;
  top: number;
  bottom: number;
  visible: boolean;
  elements: Array<ElementInterface>;

  constructor(top, bottom, height) {
    this.top = top;
    this.bottom = bottom;
    this.height = height;
  }
}
