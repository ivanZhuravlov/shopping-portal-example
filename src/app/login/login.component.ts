import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private us: UsersService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.failedLogin = false;
  }

  title = 'login';

  form: FormGroup;
  failedLogin;

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    this.failedLogin = false;
    if (this.form.valid) {
      this.auth.login(this.form.getRawValue()).then(status => {
        if (!status) {
          console.log(status);
          // console.log('Failed login.');
          this.failedLogin = true;
        } else {
          // console.log('Successful login.');
          this.us.getUserById(this.auth.user._id).then(() => this.router.navigate([`/${this.auth.user.type}`], { queryParams: { trigger: 'SIGN_IN' } }));

        }
      });
    }

  }

  routeToRegistration(): void {
    this.router.navigate(['/register'], { queryParams: { trigger: 'SIGN_IN' } });
  }
}
