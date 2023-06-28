import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstagramTabComponent } from './components/instagram-tab/instagram-tab.component';
import { TwitterTabComponent } from './components/twitter-tab/twitter-tab.component';
import { YoutubeTabComponent } from './components/youtube-tab/youtube-tab.component';
import { AdminGuard } from './guard/admin.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GraphicFromInfluencersComponent } from './pages/graphic-from-influencers/graphic-from-influencers.component';
import { InfluencerDashboardComponent } from './pages/influencer-dashboard/influencer-dashboard.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path: 'cadastro',
    component: RegisterComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'grafico',
    component: GraphicFromInfluencersComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'dashboard/:id',
    component: InfluencerDashboardComponent,
    children: [
      { path: 'yt', component: YoutubeTabComponent },
      { path: 'insta', component: InstagramTabComponent },
      { path: 'tw', component: TwitterTabComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
