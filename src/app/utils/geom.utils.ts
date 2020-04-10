export function isPointInsideCircle(xc: number, yc: number, xr:  number, yr: number, radius: number) {
  const d = Math.sqrt(Math.pow(xr - xc, 2) + Math.pow(yr - yc, 2));
  return d < radius || d === radius;
}

export function convertToLocalCoordinate(c, offset) {
  return c - offset;
}

export function getLocalPointData(x, y, offset) {
  return {
    x: convertToLocalCoordinate(x, offset.left),
    y: convertToLocalCoordinate(y, offset.top)
  };
}

export class Lagrange {
  public xs: Array<number>;
  public ys: Array<number>;
  public ws: Array<number> = [];

  constructor(x1: number, y1: number, x2, y2) {
    this.xs = [x1, x2];
    this.ys = [y1, y2];
    this.updateWeights();
  }

  private updateWeights() {
    const k = this.xs.length;
    let w;
    for (let j = 0; j < k; ++j) {
      w = 1;
      for (let i = 0; i < k; ++i) {
        if (i !== j) {
          w *= this.xs[j] - this.xs[i];
        }
      }
      this.ws[j] = 1 / w;
    }
  }

  public addPoint(x: number, y: number) {
    this.xs.push(x);
    this.ys.push(y);
    this.updateWeights();
    return this.xs.length - 1;
  }

  public changePoint(index, x, y) {
    this.xs[index] = x;
    this.ys[index] = y;
    this.updateWeights();
  }

  public valueOf(x: number) {
    let a = 0;
    let b = 0;
    let c = 0;
    for (let j = 0; j < this.xs.length; ++j) {
      if (x !== this.xs[j]) {
        a = this.ws[j] / (x - this.xs[j]);
        b += a * this.ys[j];
        c += a;
      } else {
        return this.ys[j];
      }
    }
    return b / c;
  }
}
