import { Token } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.scss']
})
export class NavAdminComponent implements OnInit {

  superAdminLogged!: boolean

  constructor(private authService: AuthService, private route: Router ) { }

  ngOnInit(): void {
    this.authService.isSuperAdmin().subscribe((superAdmin) => {
      this.superAdminLogged = superAdmin 
    })
  }

@Input()
tituloCartao: string = '' 

deslogar() {
  this.authService.signOut().subscribe(
    (success) => {
      this.route.navigateByUrl('/')
    }
  )
}

}
