import { Injectable } from '@angular/core';

import { Admin } from 'src/app/admin/models/admin';
import { from, } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = 'https://us-central1-api-test-9fbf3.cloudfunctions.net/admin'

  constructor(
    private db: AngularFirestore, private http: HttpClient, private authService: AuthService
  ) { }


  createAdmin(admin: Admin) {
    return this.http.post(this.baseUrl, admin, {
      headers: { Authorization: `Bearer ${this.authService.userToken}` },
    })
  }

}
