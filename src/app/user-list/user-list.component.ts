import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input() users = [];
  @Input() loggedInUserType = '';

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    if (!this.loggedInUserType) {
      this.loggedInUserType = this.auth.user.type || '';
    }
  }

}
