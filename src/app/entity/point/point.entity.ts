import { POINT_COLOR_DEFAULT, POINT_RADIUS_DEFAULT } from '../../constants/constants';

export interface IPoint {
  id: number;
  x: number;
  y: number;
  color: string;
  draw(): void;
}

export interface IPointData {
  readonly x: number;
  readonly y: number;
}

export class Point implements IPoint {
  public x;
  public y;
  public id;
  public radius = POINT_RADIUS_DEFAULT;
  public color = POINT_COLOR_DEFAULT;
  constructor(private ctx: CanvasRenderingContext2D, other?: IPointData) {
    if (other) {
      this.x = other.x;
      this.y = other.y;
      this.id = this.x + this.y;
    }
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  move(x: number, y: number): Point {
    this.x = x;
    this.y = y;
    return this;
  }

  selected() {
    return this.color = '#FF0000';
  }

  unSelected() {
    return this.color = POINT_COLOR_DEFAULT;
  }
}
