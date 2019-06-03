interface ChunkInterface {
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

  setTop(top) {
    this.top = top;
  }

  setBottom(bottom) {
    this.bottom = bottom;
  }

  setHeight(height) {
    this.height = height;
  }
}
