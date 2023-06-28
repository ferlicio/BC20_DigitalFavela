import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedOutGuard } from '../guards/logged-out.guard';
import { LoggedGuard } from '../guards/logged.guard';
import { RedesComponent } from './pages/redes/redes.component';
import { RegisterComponent } from './pages/register/register.component';
import { InfluencerDashboardComponent } from './pages/influencer-dashboard/influencer-dashboard.component';

const routes: Routes = [
  {
    path: 'cadastro',
    component: RegisterComponent,
    canActivate: [LoggedOutGuard]
  },

  {
    path: 'dashboard',
    component: InfluencerDashboardComponent,
    canActivate: [LoggedGuard],
    children: [
      {path: 'redes', component: RedesComponent},
      {path: '', pathMatch: 'full', redirectTo: 'redes'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfluencerRoutingModule { }
