import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfluencerRoutingModule } from './influencer-routing.module';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { RedesComponent } from './pages/redes/redes.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { InfluencerDashboardComponent } from './pages/influencer-dashboard/influencer-dashboard.component';


@NgModule({
  declarations: [
    SignupFormComponent,
    RedesComponent,
    RegisterComponent,
    InfluencerDashboardComponent

  ],
  imports: [
    CommonModule,
    InfluencerRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    }),
  ]
})
export class InfluencerModule { }
