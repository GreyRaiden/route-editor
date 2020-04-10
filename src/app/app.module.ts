import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.router';
import { AppComponent } from './app.component';
import { EditorComponent } from './pages/editor/editor.component';
import { EditorBoardComponent } from './components/editor-board/editor-board.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    EditorBoardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [EditorComponent]
})
export class AppModule { }
