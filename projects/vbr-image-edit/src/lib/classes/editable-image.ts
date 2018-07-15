import { IEditableImage } from '../editable-image.interface';

export class EditableImage implements IEditableImage {
  left: number;
  top: number;
  source: string;
  width: number;
  height: number;
  degrees: number;
  // radians: number;
  // transform: string; // eg. 'rotate(45deg)'
  ratio: number;
  isPortrait: boolean;
  imageElement: HTMLImageElement;

  constructor(img: HTMLImageElement) {
    const funcw = img.width > 400 ? Math.min : Math.max;
    const funch = img.height > 400 ? Math.min : Math.max;
    const width = funcw.call(this, img.width, 400);
    const height = funch.call(this, img.height, 400);
    this.top = 0;
    this.left = 0;

    this.isPortrait = img.width <= img.height;
    this.ratio = this.isPortrait ? (img.height / img.width) : (img.width / img.height);
    this.width = !this.isPortrait ? height * this.ratio : width;
    this.height = !this.isPortrait ? height : width * this.ratio;
    this.source = img.src;
  }
}
