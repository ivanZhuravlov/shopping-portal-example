import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductsService} from './services/products.service';
import {AuthService} from './services/auth.service';
import {UsersService} from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopping-portal-example';

  constructor(private auth: AuthService, private us: UsersService) {
  }

  ngOnInit(): void {
    let userId;
    userId = '5fac649719180e9934dba333';
    userId = '5fac6c5883408e2854af7a1c';

    // tslint:disable-next-line:variable-name
    // const _user = this.auth.login({name: 'pablouser3', password: 'pablopass23'});
    // _user.then(status => console.log('User status:', status));


    // this.us.getUserById(userId).then(user => console.log('User received.'));

    setInterval(() => {
      // this.cdRef.detectChanges();
      // console.log('Detecting changes...');
      // console.log('Users:', this.userList);
      // console.log('User type:', this.userType);
      // console.log('Products:', this.productList);
      // console.log('Cart:', this.cartList);
      // console.log('Wishlist:', this.wishList);
    }, 2000);

    setTimeout(() => {
      // this.us.getCart('5fac649719180e9934dba333');
      // this.us.getWishlist('5fac649719180e9934dba333');
      // this.us.getUserById('5fac649719180e9934dba333').then(user => console.log('User received.'));
    }, 2000);
  }

}
