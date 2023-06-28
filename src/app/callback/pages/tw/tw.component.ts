import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SocialsService } from '../../services/socials.service';

@Component({
  selector: 'app-tw',
  templateUrl: './tw.component.html',
  styleUrls: ['./tw.component.scss'],
})
export class TwComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private socialService: SocialsService,
    private authService: AuthService
  ) { }
  error: boolean = false;
  success: boolean = false;
  timer: number = 30;

  ngOnInit() {
    this.timeout();
    this.route.queryParams.subscribe((params) => {
      if (params['error'] || !params['code']) {
        this.error = true
        return
      }
      this.success = true
      const code = params['code'];
      this.authService.logged.subscribe((user) => {
        this.createCollection(code, user?.uid!).subscribe((x) => {
        });
      });
    });
  }

  createCollection(code: string, uid: string) {
    return this.socialService.twitterCreateCollection(code, uid!);
  }

  timeout() {
    const time = setInterval(() => {
      this.timer = this.timer - 1;
    }, 1000);
    setTimeout(() => {
      clearInterval(time);
      window.close();
    }, 30000);
  }
}
