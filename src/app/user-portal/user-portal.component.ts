/* tslint:disable:max-line-length variable-name */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.css']
})
export class UserPortalComponent implements OnInit {

  constructor(private auth: AuthService, private ps: ProductsService, private us: UsersService) {
    this.us.user.subscribe(_user => {
      this.user = _user;
      this.userType = _user.type;
    });

    this.ps.products.subscribe(products => this.productList = products);
    this.us.cart.subscribe(cart => {
      const nextCart = [];
      if (cart && cart.length) {
        // FIXME: immediate update of cart and wishlist after delete in UsersServices results in 404 errors from multiple attempts at delete of the same product
        // @ts-ignore
        cart.forEach(slimProduct => this.ps.getById(slimProduct._id).then(({ _id, name, brand }) => _id ? nextCart.push({ _id, name, brand, count: slimProduct.count }) : this.us.deleteCart(this.user._id, slimProduct._id)
        ).catch(() => {}));
      }
      this.cartList = nextCart;
    });
    this.us.wishlist.subscribe(wishlist => {
      const nextWishlist = [];
      if (wishlist) {
        // @ts-ignore
        wishlist.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => product ? nextWishlist.push(product) : this.us.deleteWishlist(this.user._id, slimProduct._id)
          ).catch(() => {}));
      }
      this.wishList = nextWishlist;
    });

  }

  title = 'user-portal';

  user = { _id: '', name: '', type: '' };
  userType = '';
  productList = [];
  cartList = [];
  wishList = [];

  ngOnInit(): void {
    this.us.getUserById(this.auth.user._id);
    this.ps.getProducts();
  }
}
