import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Title } from '@angular/platform-browser';
import { from, map, mergeMap, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle("DigitalFavela - Login");
  }

  signIn() {
    this.authService.signIn(this.email, this.password).pipe(
      this.toast.observe({
        loading: 'Carregando...',
        success: 'Logado com sucesso',
        error: 'Erro ao logar'
      }), map(async (res) => {
        const token = await res.user?.getIdTokenResult()
        if (token?.claims['admin']) {
          return this.router.navigateByUrl('admin/dashboard')
        }
        return this.router.navigateByUrl('influencer/dashboard/redes')
      })
    ).subscribe(() => {
    })
  }
}
