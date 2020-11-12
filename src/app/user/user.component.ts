import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input() userName = '';
  @Input() userType = '';

  @Input() loggedInUserType = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  pass(): void {
    throw new Error('unspecified functionality');
  }

}
