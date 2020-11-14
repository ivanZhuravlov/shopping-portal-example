import {Component, OnInit} from '@angular/core';
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

  title = 'user-portal';

  user = {_id: '', name: '', type: ''};
  userType = '';
  productList = [];
  cartList = [];
  wishList = [];


  constructor(private auth: AuthService, private ps: ProductsService, private us: UsersService, private router: Router) {
    // tslint:disable-next-line:variable-name
    this.us.user.subscribe(_user => {
      this.user = _user;
      this.userType = _user.type;
      // const nextCart = [];
      // if (_user.cart && _user.cart.length) {
      //   // @ts-ignore
      //   // tslint:disable-next-lin`e:max-line-length
      // tslint:disable-next-line:max-line-length
      //   _user.cart.forEach(slimProduct => this.ps.getById(slimProduct._id).then(({_id, name, brand}) => nextCart.push({_id, name, brand, count: slimProduct.count})));
      // }
      // this.cartList = nextCart;
      // const nextWishlist = [];
      // if (_user.wishlist) {
      //   _user.wishlist.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => nextWishlist.push(product)));
      // }
      // this.wishList = nextWishlist;
    });

    this.ps.products.subscribe(products => this.productList = products);
    this.us.cart.subscribe(cart => {
      const nextCart = [];
      if (cart && cart.length) {
        // tslint:disable-next-line:max-line-length
        cart.forEach(slimProduct => this.ps.getById(slimProduct._id).then(({_id, name, brand}) => {
          if (!_id) {
            this.us.deleteCart(this.user._id, slimProduct._id);
          } else {
            nextCart.push({_id, name, brand, count: slimProduct.count});
          }
        }).catch(() => {}));
      }
      this.cartList = nextCart;
    });
    this.us.wishlist.subscribe(wishlist => {
      const nextWishlist = [];
      if (wishlist) {
        wishlist.forEach(slimProduct => this.ps.getById(slimProduct._id).then(product => {
          if (!product) {
            this.us.deleteWishlist(this.user._id, slimProduct._id);
          } else {
            nextWishlist.push(product);
          }
        }));
      }
      this.wishList = nextWishlist;
    });

  }

  ngOnInit(): void {
    this.us.getUserById(this.auth.user._id);
    this.ps.get();
  }

  logout(): void {
    this.auth.logout();
    this.us.getUserById('');
    this.router.navigate(['/login', {trigger: 'SIGN_OUT'}]);
  }

}
