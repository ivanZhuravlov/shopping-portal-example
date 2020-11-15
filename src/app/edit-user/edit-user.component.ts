/* tslint:disable:max-line-length */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private us: UsersService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: [''],
      password: ['', [Validators.minLength(4)]]
    });
    this.failedEdit = false;
    this.selectedUserType = '  ';
    this.loggedInUserType = 'none';
  }

  title = 'edit-product';

  form: FormGroup;
  failedEdit;
  successfulEdit;
  userId;
  userName;
  userType;

  loggedInUserType;
  selectedUserType;

  paramsSub;

  ngOnInit(): void {
    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.userId = params.userId || this.routeToAdminPortal();
      this.us.getUserById(this.userId).then(user => {
        this.userName = user.name;
        this.userType = user.type;
        this.selectedUserType = user.type;
      });
      this.us.getUserById(this.auth.user._id);
    });
  }

  submitEditUserForm(): void {
    this.failedEdit = false;
    this.successfulEdit = false;
    if (this.form.valid) {
      const editFormVal = this.form.getRawValue();
      const userUpdate = {
        type: ''
      };
      for (const editProp in editFormVal) {
        if (editFormVal[editProp]) {
          userUpdate[editProp] = editFormVal[editProp];
        }
      }
      userUpdate.type = this.selectedUserType;
      // console.log(editFormVal);
      // console.log(userUpdate);
      this.us.putUser(this.userId, userUpdate).then(user => {
        if (!user) {
          this.failedEdit = true;
          this.successfulEdit = false;
        } else {
          this.successfulEdit = true;
          this.failedEdit = false;
          // this.routeToAdminPortal();
        }
      });
    }
  }

  routeToAdminPortal(): void {
    this.router.navigate(['/admin'], { queryParams: { trigger: 'EDIT-USER' } });
  }

}
