import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Influencer } from 'src/app/influencer/models/influencer';
import { InfluencerService } from 'src/app/influencer/services/influencer.service';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-influencer-dashboard',
  templateUrl: './influencer-dashboard.component.html',
  styleUrls: ['./influencer-dashboard.component.scss']
})
export class InfluencerDashboardComponent implements OnInit {
  influencer!: Influencer;
  constructor(private tabService: TabService, private route: ActivatedRoute, private influencerService: InfluencerService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? ''
      this.influencerService.getInfluencer(id).subscribe((res) => {
        this.influencer = res
        this.tabService.setInfluencer(res)
      })
    })
  }
  dashboard() {
    this.router.navigateByUrl('admin/dashboard')
  }
}