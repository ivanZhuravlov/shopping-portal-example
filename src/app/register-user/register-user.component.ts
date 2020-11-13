import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  title = 'register-user';

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

  form: FormGroup;
  failedRegistration;
  userType;
  loggedInUserType;

  ngOnInit(): void {
  }

  submitRegisterForm(): void {
    if (this.form.valid) {
      // console.log(this.form.getRawValue());
      const registerFormVal = this.form.getRawValue();
      registerFormVal.type = this.userType;
      this.us.postUser(registerFormVal).then(user => {
        if (!user) {
          console.log(user);
          this.failedRegistration = true;
        } else {
          this.router.navigate(['/login', {trigger: 'REGISTER'}]);
        }
      });

      // this.auth.login(this.form.getRawValue()).then(status => {
      //   if (!status) {
      //     console.log(status);
      //     // console.log('Failed login.');
      //     this.failedRegistration = true;
      //   } else {
      //     // console.log('Successful login.');
      //     this.us.getUserById(this.auth.user._id).then(() => this.router.navigate(['/login', {trigger: 'REGISTER'}]));
      //
      //   }
      // });
    }

  }

  routeToLogin(): void {
    this.router.navigate(['/login', {trigger: 'REGISTER'}]);
  }

}
