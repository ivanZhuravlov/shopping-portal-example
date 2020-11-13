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

  parents = {
    admin: ['admin-portal'],
    user: ['user-portal'],
    logout: ['admin-portal', 'user-portal'],

  };

  @Input() userName = '';
  @Input() userType = '';
  @Input() parent = '';

  cart = '';

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
    this.us.getCart(this.auth.user._id).then(_cart => {
      if (_cart.length) {
        this.us.putUser(this.auth.user._id, {cart: []});
        return _cart;
      }
      // tslint:disable-next-line:variable-name max-line-length
    }).then(_cart => alert(`Successfully purchased ${_cart.length} unique item${_cart.length === 1 ? '' : 's'} in cart!`)).catch(() => alert('No items in cart!'));

  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login', {trigger: 'SIGN_OUT'}]);
  }

  routeToUserPortal(): void {
    this.router.navigate(['/user', {trigger: 'ADMIN_PORTAL'}]);
  }

  routeToAdminPortal(): void {
    this.router.navigate(['/admin', {trigger: 'USER_PORTAL'}]);
  }

  unimplemented(direct: boolean = true): void {
    if (direct) {
      throw new Error('function not specified');
    } else {
      throw new Error('unimplemented');
    }
  }

}
