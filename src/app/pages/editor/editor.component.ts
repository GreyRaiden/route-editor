import {Component, ViewChild, OnInit, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { EditorBoardComponent } from '../../components/editor-board/editor-board.component';
import { Key } from 'ts-keycode-enum';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editorBoard') editorBoard: EditorBoardComponent;
  editorBoardEl: HTMLElement;
  cleanups: Function[] = [];
  highlightMode = false;

  constructor(private zone: NgZone, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
  }

  addEventHandler(element: HTMLElement | Document | Window,
                  name: keyof HTMLElementEventMap, handler: (e: Event) => any, useCapture?: boolean) {
    element.addEventListener(name as any, handler, useCapture);
    this.cleanups.push(() => {
      element.removeEventListener(name as any, handler, useCapture);
    });
  }

  readonly onEditorBoardMouseDown = (e: MouseEvent) => {
    const isInside = this.editorBoard.isPointInsideCircle(e.pageX, e.pageY);
    if (isInside) {
      const point =  this.editorBoard.getPoint(e.pageX, e.pageY);
      this.editorBoard.setSelectedPoint(point);
      if (this.highlightMode) {
        this.editorBoard.pointSelected();
      }
      this.editorBoardEl.addEventListener( 'mousemove', this.onEditorBoardMouseMove);
      return this.editorBoardEl.addEventListener( 'mouseup', this.onEditorBoardMouseUp);
    }
    const newPoint = this.editorBoard.addPoint({x: e.pageX, y: e.pageY});
    this.editorBoard.clearSelectable();
    if (this.editorBoard.isDrawBezierCurves()) {
      this.editorBoard.drawBezierCurves();
    } else {
      newPoint.draw();
    }
  }

  readonly onEditorBoardMouseMove = (e: MouseEvent) => {
    this.editorBoard.pointMove(e.pageX, e.pageY);
  }

  readonly onEditorBoardMouseUp = (e: MouseEvent) => {
    this.editorBoardEl.removeEventListener( 'mousemove', this.onEditorBoardMouseMove);
    this.editorBoardEl.removeEventListener( 'mouseup', this.onEditorBoardMouseUp);
  }

  readonly onDocumentKeydown = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case Key.Shift:
        this.highlightMode = true;
        e.preventDefault();
        return;
      case Key.Delete:
        if (this.highlightMode) {
          this.editorBoard.removeSelectable();
        }
        e.preventDefault();
        return;
    }
  };

  readonly onDocumentKeyUp = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case Key.Shift:
        this.highlightMode = false;
        return;
    }
  }

  ngAfterViewInit() {
    this.invokeLater(() => {
      this.editorBoardEl = document.querySelector('.editor-board');
      if (this.editorBoardEl) {
        this.addEventHandler(this.editorBoardEl, 'mousedown', this.onEditorBoardMouseDown);
        this.addEventHandler(document, 'keydown', this.onDocumentKeydown);
        this.addEventHandler(document, 'keyup', this.onDocumentKeyUp);
      }
    });
  }

  invokeLater(f: () => void) {
    this.zone.run(() => setTimeout(() => {
      f();
    }));
  }


}
