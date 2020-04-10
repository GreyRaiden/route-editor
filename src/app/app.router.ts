import { Routes } from '@angular/router';
import { EditorComponent } from './pages/editor/editor.component';

export const appRoutes: Routes = [
  {
    path: 'editor',
    component: EditorComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'editor'
  }
];
