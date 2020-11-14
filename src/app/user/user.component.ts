import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from '../services/users.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() userId = '';
  @Input() userName = '';
  @Input() userType = '';

  @Input() loggedInUserType = '';

  constructor(private auth: AuthService, private us: UsersService, private router: Router) {
  }

  ngOnInit(): void {
  }

  editUser(): boolean | void {
    // TODO: implement edit user server request and ui
    this.unimplemented(false);
  }

  deleteUser(): boolean | void {
    this.us.deleteUser(this.userId).then(id => {
      if (this.userId === this.auth.user._id) {
        this.logout();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login', {trigger: 'USER_DELETED'}]);
  }

  unimplemented(direct: boolean = true): void {
    if (direct) {
      throw new Error('function not specified');
    } else {
      throw new Error('unimplemented');
    }
  }

}
