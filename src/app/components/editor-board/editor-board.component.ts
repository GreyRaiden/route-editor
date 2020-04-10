import {Component, ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef} from '@angular/core';
import { BoardBg, IBoardBg } from '../../entity/board-bg/board-bg.entity';
import {IPointData, Point} from '../../entity/point/point.entity';
import { BG_IMG_HEIGHT_DEFAULT, BG_IMG_WIDTH_DEFAULT, POINT_COLOR_DEFAULT } from '../../constants/constants';
import { isPointInsideCircle, getLocalPointData } from '../../utils/geom.utils';

export interface IBoardOffset {
  left: number;
  top: number;
}
@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-editor-board',
  templateUrl: './editor-board.component.html',
  styleUrls: ['./editor-board.component.scss']
})

export class EditorBoardComponent implements OnInit {
  // Get reference to the canvas.
  @ViewChild('editorBoard')
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  boardBg: IBoardBg;
  pointList: Point[] = [];
  selectedPoint: Point;
  selectableList: Point[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = BG_IMG_WIDTH_DEFAULT;
    this.ctx.canvas.height = BG_IMG_HEIGHT_DEFAULT;
    this.boardBg = new BoardBg(this.ctx);
    this.boardBg.draw();
  }

  addPoint(pointData: IPointData): Point {
    const localPointData = getLocalPointData(pointData.x, pointData.y, this.getBoardOffset());
    const point = new Point(this.ctx, localPointData);
    this.pointList.push(point);
    return point;
  }

  isDrawBezierCurves() {
    return this.pointList.length > 1;
  }

  drawBezierCurves() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.boardBg.reRender();
    this.reRenderPoints();
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointList[0].x, this.pointList[0].y);
    for (let i = 0; i < this.pointList.length - 1; i ++) {
      const x_mid = (this.pointList[i].x + this.pointList[i + 1].x) / 2;
      const y_mid = (this.pointList[i].y + this.pointList[i + 1].y) / 2;
      const cp_x1 = (x_mid + this.pointList[i].x) / 2;
      const cp_x2 = (x_mid + this.pointList[i + 1].x) / 2;
      this.ctx.quadraticCurveTo(cp_x1, this.pointList[i].y , x_mid, y_mid);
      this.ctx.quadraticCurveTo(cp_x2, this.pointList[i + 1].y, this.pointList[i + 1].x, this.pointList[i + 1].y);
      this.ctx.stroke();
    }
  }

  getSelectedPoint(): Point {
    return this.selectedPoint;
  }

  setSelectedPoint(point: Point) {
    return this.selectedPoint = point;
  }

  pointMove(x: number, y: number) {
    const point = this.getSelectedPoint();
    const localPointData = getLocalPointData(x, y, this.getBoardOffset());
    point.move(localPointData.x, localPointData.y);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.boardBg.reRender();
    this.reRenderPoints();
    if (this.isDrawBezierCurves()) {
      this.reRenderBezierCurves();
    }
    this.ctx.strokeStyle = POINT_COLOR_DEFAULT;
  }

  pointSelected() {
    const point = this.getSelectedPoint();
    this.addPointToSelectable(point);
    point.selected();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.boardBg.reRender();
    if (this.isDrawBezierCurves()) {
      this.reRenderBezierCurves();
    }
    this.reRenderPoints();
    this.ctx.strokeStyle = POINT_COLOR_DEFAULT;
  }

  addPointToSelectable(point: Point) {
    return this.selectableList.push(point);
  }

  clearSelectable() {
    this.pointList.forEach(p => p.unSelected());
    return this.selectableList.splice(0, this.selectableList.length);
  }

  removeSelectable() {
    this.pointList = this.pointList.filter(p => !this.selectableList.some(s => s.id === p.id));
    this.clearSelectable();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.boardBg.reRender();
    if (this.isDrawBezierCurves()) {
      this.reRenderBezierCurves();
    }
    this.reRenderPoints();
    this.ctx.strokeStyle = POINT_COLOR_DEFAULT;
  }

  reRenderPoints(): void {
    this.pointList.forEach(p => p.draw());
  }

  reRenderBezierCurves() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointList[0].x, this.pointList[0].y);
    for (let i = 0; i < this.pointList.length - 1; i ++) {
      const x_mid = (this.pointList[i].x + this.pointList[i + 1].x) / 2;
      const y_mid = (this.pointList[i].y + this.pointList[i + 1].y) / 2;
      const cp_x1 = (x_mid + this.pointList[i].x) / 2;
      const cp_x2 = (x_mid + this.pointList[i + 1].x) / 2;
      this.ctx.quadraticCurveTo(cp_x1, this.pointList[i].y , x_mid, y_mid);
      this.ctx.quadraticCurveTo(cp_x2, this.pointList[i + 1].y, this.pointList[i + 1].x, this.pointList[i + 1].y);
      this.ctx.stroke();
    }
  }

  getBoardOffset(): IBoardOffset {
    return {
      left: this.ctx.canvas.getBoundingClientRect().left,
      top: this.ctx.canvas.getBoundingClientRect().top
    };
  }

  isPointInsideCircle(xr, yr): boolean {
    const localRData = getLocalPointData(xr, yr, this.getBoardOffset());
    return this.pointList.some((p) => {
      return isPointInsideCircle(p.x, p.y, localRData.x, localRData.y, p.radius);
    });
  }

  getPoint(xr, yr): Point {
    const localRData = getLocalPointData(xr, yr, this.getBoardOffset());
    return this.pointList.find((p) => {
      return isPointInsideCircle(p.x, p.y, localRData.x, localRData.y, p.radius);
    });
  }
}
