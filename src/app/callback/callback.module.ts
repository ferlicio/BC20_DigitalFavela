import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallbackRoutingModule } from './callback-routing.module';
import { FbComponent } from './pages/fb/fb.component';
import { TwComponent } from './pages/tw/tw.component';
import { YtComponent } from './pages/yt/yt.component';

@NgModule({
  declarations: [
    FbComponent,
    TwComponent,
    YtComponent
  ],
  imports: [
    CommonModule,
    CallbackRoutingModule
  ]
})
export class CallbackModule { }
