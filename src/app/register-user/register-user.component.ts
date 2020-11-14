import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private us: UsersService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.failedRegistration = false;
    this.userType = 'user';
    if (!this.loggedInUserType) {
      this.loggedInUserType = this.auth.user.type || '';
    }
  }

  title = 'register-user';

  form: FormGroup;
  failedRegistration;
  userType;
  loggedInUserType;

  ngOnInit(): void {}

  submitRegisterForm(): void {
    if (this.form.valid) {
      const registerFormVal = this.form.getRawValue();
      registerFormVal.type = this.userType;
      this.us.postUser(registerFormVal).then(user => {
        if (!user) {
          this.failedRegistration = true;
        } else {
          this.router.navigate(['/login', { trigger: 'REGISTER' }]);
        }
      });
    }

  }

  routeToLogin(): void {
    this.router.navigate(['/login', { trigger: 'REGISTER' }]);
  }

}
