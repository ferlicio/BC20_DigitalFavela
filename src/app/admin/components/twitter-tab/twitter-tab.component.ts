import { Component, OnInit } from '@angular/core';
import { Influencer } from 'src/app/influencer/models/influencer';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-twitter-tab',
  templateUrl: './twitter-tab.component.html',
  styleUrls: ['./twitter-tab.component.scss']
})
export class TwitterTabComponent implements OnInit {
  p: number = 1;
  influencer!: Influencer;
  tweets: any[] = []
  constructor(private tabService: TabService) { }

  ngOnInit(): void {
    this.influencer = this.tabService.influencer
    this.getTweets()
  }

  getTweets() {
    const tweets = this.influencer.twitter.twitterTweets
    for (let tweet in this.influencer.twitter.twitterTweets) {
      this.tweets.push(tweets[tweet])
    }
  }
}