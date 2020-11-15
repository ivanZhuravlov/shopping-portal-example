/* tslint:disable:variable-name max-line-length */
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  constructor(private auth: AuthService, private us: UsersService, private router: Router) {
    this.us.user.subscribe(({ name, type }) => {
      this.userName = name;
      this.userType = type;
    });
    if (!this.loggedInUserType) {
      this.loggedInUserType = this.auth.user.type || '';
    }
  }

  parents = {
    admin: ['admin-portal'],
    user: ['user-portal'],
    logout: ['admin-portal', 'user-portal'],

  };

  @Input() userName = '';
  @Input() userType = '';
  @Input() parent = '';

  loggedInUserType = '';

  cart = '';

  ngOnInit(): void {
    if (!this.userName || !this.userType) {
      const { name, type } = this.auth.user;
      this.userName = name;
      this.userType = type;
    }
  }

  purchase(): void {
    this.us.getCart(this.auth.user._id).then(_cart => {
      if (_cart.length) {
        this.us.putUser(this.auth.user._id, { cart: [] }).then(() => this.us.getCart(this.auth.user._id));
        return _cart;
      }
    }).then(_cart => alert(`Successfully purchased ${_cart.length} unique item${_cart.length === 1 ? '' : 's'} in cart!`)).catch(() => alert('No items in cart!'));

  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login'], { queryParams: { trigger: 'SIGN_OUT' } });
  }

  routeToUserPortal(): void {
    this.router.navigate(['/user'], { queryParams: { trigger: this.parent.toUpperCase() } });
  }

  routeToAdminPortal(): void {
    this.router.navigate(['/admin'], { queryParams: { trigger: this.parent.toUpperCase() } });
  }

  routeToRegistration(): void {
    this.router.navigate(['/register'], { queryParams: { trigger: this.parent.toUpperCase() } });
  }

  routeToCreation(): void {
    this.router.navigate(['/create'], { queryParams: { trigger: this.parent.toUpperCase() } });
  }

}
