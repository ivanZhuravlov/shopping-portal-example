import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  constructor(private auth: AuthService, private us: UsersService, private router: Router) {
    this.us.user.subscribe(({name, type}) => {
      this.userName = name;
      this.userType = type;
    });
  }

  @Input() userName = '';
  @Input() userType = '';

  ngOnInit(): void {
    if (!this.userName || !this.userType) {
      const {name, type} = this.auth.user;
      this.userName = name;
      this.userType = type;
    }
  }

  purchase(): void {
    // console.log('purchasing...');
    // tslint:disable-next-line:variable-name
    this.us.getCart(this.auth.user._id).then(_cart => this.us.putUser(this.auth.user._id, {cart: []})).then(() => alert(`Successfully purchased cart items`));

  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login', {trigger: 'SIGN_OUT'}]);
  }

  pass(): void {
    throw new Error('unspecified functionality');
  }

}
