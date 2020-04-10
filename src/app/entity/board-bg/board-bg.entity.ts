import { BG_IMG_SRC_DEFAULT, BG_IMG_HEIGHT_DEFAULT, BG_IMG_WIDTH_DEFAULT } from '../../constants/constants';

export interface IBoardBg {
  bgImg: HTMLImageElement;
  width: number;
  height: number;
  draw(): Promise<any>;
  reRender(): void;
}

export class BoardBg implements IBoardBg {
  public bgImg;
  public width =  BG_IMG_WIDTH_DEFAULT;
  public height = BG_IMG_HEIGHT_DEFAULT;
  constructor(private ctx: CanvasRenderingContext2D) {}

  draw(): Promise<any> {
    return new Promise((resolve) => {
      this.bgImg = new Image();
      this.bgImg.src = BG_IMG_SRC_DEFAULT;
      this.bgImg.onload = () => {
        this.ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);
        return resolve();
      };
    });
  }

  reRender() {
    this.ctx.drawImage(this.bgImg, 0, 0, this.width, this.height);
  }
}
