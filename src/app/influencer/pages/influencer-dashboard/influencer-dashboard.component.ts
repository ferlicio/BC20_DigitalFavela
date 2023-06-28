import { OnInit } from '@angular/core';
import { mergeMap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Influencer } from '../../models/influencer';
import { InfluencerService } from '../../services/influencer.service';
import { Router } from '@angular/router';
import { Component } from "@angular/core";

@Component({
  selector: 'app-influencer-dashboard',
  templateUrl: './influencer-dashboard.component.html',
  styleUrls: ['./influencer-dashboard.component.scss']
})
export class InfluencerDashboardComponent implements OnInit {

  constructor(private authService: AuthService, private influencerService: InfluencerService, private route: Router) { }

  influencer!: Influencer
  
  ngOnInit(): void {
    this.loadInfluencer()
  }
  
  loadInfluencer() {
    this.authService.logged.pipe(mergeMap((user) => {
      return this.influencerService.getInfluencer(user?.uid!)
    })).subscribe((res) => {
      this.influencer = res
    })
  }



  deslogar() {
    this.authService.signOut().subscribe(
      (success) => {
        this.route.navigateByUrl('/')
      }
    )
  }

}

