import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialsService } from 'src/app/callback/services/socials.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-yt',
  templateUrl: './yt.component.html',
  styleUrls: ['./yt.component.scss']
})
export class YtComponent implements OnInit {
  constructor(private route: ActivatedRoute, private socialService: SocialsService, private authService: AuthService) { }
  error: boolean = false
  permission_denied: boolean = false
  success: boolean = false
  timer: number = 30;

  ngOnInit() {
    this.timeout()
    this.route.queryParams.subscribe(params => {
      if (params['scope'] == "https://www.googleapis.com/auth/youtubepartner-channel-audit https://www.googleapis.com/auth/youtube.readonly" || params['scope'] == "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner-channel-audit" && params['code']) {
        const code = params['code']
        this.success = true
        this.authService.logged.subscribe((user) => {
          this.createCollection(code, user?.uid!).subscribe(() => { 
          })
        })
    } else {
        this.permission_denied = true
      }
    })
  }

  createCollection(code: string, uid: string) {
    return this.socialService.youtubeCreateCollection(code, uid!)
  }

  timeout() {
    const time = setInterval(() => {
      this.timer = this.timer - 1
    }, 1000)
    setTimeout(() => {
      clearInterval(time)
      window.close()
    }, 30000)
  }


}
