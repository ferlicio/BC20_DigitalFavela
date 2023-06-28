import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InfluencerService } from 'src/app/influencer/services/influencer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userLoggedIn = false
  adminRights = false

  constructor(private authService: AuthService, private influencerService: InfluencerService, private router: Router) { }
  user$: any
  ngOnInit(): void {
    this.userLogged()
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      this.userLoggedIn = false
      this.adminRights = false
    })
  }

  userLogged() {
    this.authService.logged.subscribe(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult()
        this.userLoggedIn = true
        if (token.claims['admin']) { this.adminRights = true }
        return this.router.parseUrl('')
      }
      this.userLoggedIn = false
      return this.router.parseUrl('/auth/login')
    })
  }
}
