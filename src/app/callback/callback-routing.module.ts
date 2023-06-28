import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FbComponent } from './pages/fb/fb.component';
import { TwComponent } from './pages/tw/tw.component';
import { YtComponent } from './pages/yt/yt.component';
import { LoggedGuard } from '../guards/logged.guard';

const routes: Routes = [
  {
    path: 'fb',
    component: FbComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'tw',
    component: TwComponent,
    canActivate: [LoggedGuard]
  },
  {
    path: 'yt',
    component: YtComponent,
    canActivate: [LoggedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallbackRoutingModule { }
