import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private auth: AuthService, private ps: ProductsService, private us: UsersService, private router: Router) { }

  @Input() productId;
  @Input() productName;
  @Input() productBrand;
  @Input() cartCount;
  @Input() displayType = ''; // 'all' or 'cart' or 'wishlist'
  @Input() parent = '';

  parents = {
    admin: ['admin-portal'],
    user: ['user-portal'],
  };

  ngOnInit(): void {
    if (this.productId && (!this.productName || !this.productBrand)) {
        this.ps.getById(this.productId).then(product => {
          this.productName = product.name;
          this.productBrand = product.brand;
        });
    }
  }

  addToCart(): boolean {
    const success = this.auth.loggedIn;
    if (success) {
      this.us.postCart(this.auth.user._id, this.productId);
    }
    return success;
  }

  editCartQuantity(increment: number): boolean {
    const success = this.auth.loggedIn;
    if (success) {
      this.us.putCart(this.auth.user._id, this.productId, increment);
    }
    return success;
  }

  removeFromCart(): boolean {
    const success = this.auth.loggedIn;
    if (success) {
      this.us.deleteCart(this.auth.user._id, this.productId);
    }
    return success;
  }

  moveToWishlist(): boolean {
    let success = this.auth.loggedIn;
    if (success) {
      success &&= this.addToWishlist() && this.removeFromCart();
    }
    return success;
  }

  addToWishlist(): boolean {
    const success = this.auth.loggedIn;
    if (success) {
      this.us.postWishlist(this.auth.user._id, this.productId);
    }
    return success;
  }

  removeFromWishlist(): boolean {
    const success = this.auth.loggedIn;
    if (success) {
      this.us.deleteWishlist(this.auth.user._id, this.productId);
    }
    return success;
  }

  moveToCart(): boolean {
    let success = this.auth.loggedIn;
    if (success) {
      success &&= this.addToCart() && this.removeFromWishlist();
    }
    return success;
  }

  editProduct(): boolean | void {
    this.router.navigate(['/edit/product'], { queryParams: { trigger: 'ADMIN-PORTAL', productId: this.productId } });
  }

  deleteProduct(): boolean | void {
    this.ps.deleteProduct(this.productId);
  }

}
