import { Component, Input, OnInit } from '@angular/core';
import { Influencer } from 'src/app/influencer/models/influencer';

@Component({
  selector: 'influencer-card',
  templateUrl: './influencer-card.component.html',
  styleUrls: ['./influencer-card.component.scss']
})
export class InfluencerCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  influencer!: Influencer
  @Input()
  picture: any
}
