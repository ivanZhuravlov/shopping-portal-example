import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from '../services/users.service';

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

  constructor(private us: UsersService) {
  }

  ngOnInit(): void {
  }

  editUser(): boolean | void {
    // TODO
    this.unimplemented(false);
  }

  deleteUser(): boolean | void {
    this.us.deleteUser(this.userId);
  }

  unimplemented(direct: boolean = true): void {
    if (direct) {
      throw new Error('function not specified');
    } else {
      throw new Error('unimplemented');
    }
  }

}
