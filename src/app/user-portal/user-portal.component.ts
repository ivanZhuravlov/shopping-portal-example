import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {ProductsService} from '../services/products.service';
import {UsersService} from '../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {

  userType = '';
  productList = [];
  cartList = [];
  wishList = [];


  constructor(private auth: AuthService, private ps: ProductsService, private us: UsersService, private router: Router) {
    this.us.user.subscribe(user => {
      this.userType = user.type;
      const nextCart = [];
      user.cart.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => nextCart.push(product)));
      this.cartList = nextCart;
      const nextWishlist = [];
      user.wishlist.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => nextWishlist.push(product)));
      this.wishList = nextWishlist;
    });

    this.ps.products.subscribe(products => this.productList = products);
    this.us.cart.subscribe(cart => {
      const nextCart = [];
      if (cart) {
        cart.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => nextCart.push(product)));
      }
      this.cartList = nextCart;
    });
    this.us.wishlist.subscribe(wishlist => {
      const nextWishlist = [];
      if (wishlist) {
        wishlist.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => nextWishlist.push(product)));
      }
      this.wishList = nextWishlist;
    });

  }

  ngOnInit(): void {
    this.us.getUserById(this.auth.user._id);
  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login', {trigger: 'SIGN_OUT'}]);
  }

}
