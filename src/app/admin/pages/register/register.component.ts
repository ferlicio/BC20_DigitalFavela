import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AdminService } from '../../services/admin.service';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordDontMatch: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  disable: boolean = false
  formAdmin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    name: ['', [Validators.required]],
  }, { validators: passwordMatchValidator() })


  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private title: Title,
  ) { }


  ngOnInit(): void {
    this.title.setTitle("DigitalFavela - Administrador");
  }


  addNewAdmin() {
    const admin = {
      email: this.formAdmin.value.email,
      password: this.formAdmin.value.password,
      displayName: this.formAdmin.value.name,
    }
    this.adminService.createAdmin(admin).subscribe((x) => {
    })
  }

}
