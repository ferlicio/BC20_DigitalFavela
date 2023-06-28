import { Injectable } from '@angular/core';
import { Influencer } from 'src/app/influencer/models/influencer';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  influencer!: Influencer;
  constructor() { }

  setInfluencer(influencer: Influencer) {
    this.influencer = influencer
  }
}
