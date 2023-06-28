import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialsService } from 'src/app/callback/services/socials.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['./fb.component.scss']
})
export class FbComponent implements OnInit {
  constructor(private route: ActivatedRoute, private socialService: SocialsService, private authService: AuthService, private http: HttpClient) { }
  error: boolean = false
  permission_denied: boolean = false
  success: boolean = false
  timer: number = 30;

  ngOnInit() {
    this.timeout()
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.error = true
      } else {
        const denied_permissions = params['denied_scopes']
        const code = params['code']
        if (!denied_permissions && params['code']) {
          this.success = true
          this.authService.logged.subscribe((user) => {
            this.createCollection(code, user?.uid!).subscribe(() => { })
          })
        } else {
          this.permission_denied = true
        }
      }
    })
  }

  createCollection(code: string, uid: string) {
    return this.socialService.facebookCreateCollection(code, uid!)
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


