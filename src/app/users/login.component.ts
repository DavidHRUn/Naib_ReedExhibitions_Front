import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './models/user';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLoginH: FormGroup;
  user: User;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {
    this.user = new User();
  }

  ngOnInit(): void {
    document.body.style.backgroundImage = "url(../../assets/img_login/fondo.png)";
    this.validFormLogin();
    this.authenticated();
  }

  validFormLogin() {
    this.formLoginH = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required]
    })
  }

  login() {
    this.spinner.show();
    this.user.email = this.formLoginH.value.email;
    this.user.password = this.formLoginH.value.password;
    this.authService.login(this.user).subscribe(response => {
      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      let userH = this.authService.user;
      this.spinner.hide();
      this.rolRedirect(userH.rol);
    }, error => {
      if (error.status == 400) {//Error 400
        this.spinner.hide();
        Swal.fire({
          icon: 'info',
          title: 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 1500
        })
      } else if (error.status == 401) {//Error 401
        this.spinner.hide();
        Swal.fire({
          icon: 'info',
          title: 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 1500
        })
      }

    }
    );
  }

  rolRedirect(x: any) {
    let h = x.toString();
    switch (h) {
      case 'ROLE_FM':
        this.router.navigate(['/listaExpositores']);
        break;
      case 'ROLE_ADMINFM':
        this.router.navigate(['/adminFM']);
        break;
    }
  }

  authenticated() {
    if (this.authService.isAuthenticated()) {
      this.rolRedirect(this.authService.user.rol);
    }
  }
}
