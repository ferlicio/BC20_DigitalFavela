import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InfluencerCardComponent } from './components/influencer-card/influencer-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './pages/register/register.component';
import { GraphicFromInfluencersComponent } from './pages/graphic-from-influencers/graphic-from-influencers.component';
import { NavAdminComponent } from './components/nav-admin/nav-admin.component';
import { NumbersPipe } from './pipes/numbers.pipe';
import { InfluencerDashboardComponent } from './pages/influencer-dashboard/influencer-dashboard.component';
import { YoutubeTabComponent } from './components/youtube-tab/youtube-tab.component';
import { InstagramTabComponent } from './components/instagram-tab/instagram-tab.component';
import { TwitterTabComponent } from './components/twitter-tab/twitter-tab.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InstaPhotoComponent } from './components/insta-photo/insta-photo.component';
import { YoutubeVideoComponent } from './components/youtube-video/youtube-video.component';
import { SafePipe } from './pipes/safe.pipe'

@NgModule({
  declarations: [
    DashboardComponent,
    InfluencerCardComponent,
    RegisterComponent,
    GraphicFromInfluencersComponent,
    NavAdminComponent,
    NumbersPipe,
    InfluencerDashboardComponent,
    YoutubeTabComponent,
    InstagramTabComponent,
    TwitterTabComponent,
    InstaPhotoComponent,
    YoutubeVideoComponent,
    SafePipe
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ]
})
export class AdminModule { }