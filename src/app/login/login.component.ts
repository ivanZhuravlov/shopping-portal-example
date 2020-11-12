import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {trigger} from '@angular/animations';
import {UsersService} from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  failedLogin;

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private us: UsersService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.failedLogin = false;
  }

  ngOnInit(): void {
  }

  submitLoginForm(): void {
    if (this.form.valid) {
      // console.log(this.form.getRawValue());
      this.auth.login(this.form.getRawValue()).then(status => {
        if (!status) {
          console.log(status);
          // console.log('Failed login.');
          this.failedLogin = true;
        } else {
          // console.log('Successful login.');
          this.us.getUserById(this.auth.user._id).then(() => this.router.navigate([`/${this.auth.user.type}`, {trigger: 'SIGN_IN'}]));

        }
      });
    }

  }

}
