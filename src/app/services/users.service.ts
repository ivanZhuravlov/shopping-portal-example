import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ProductsService} from './products.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
    this.user = new Subject<any>();
    this.users = new Subject<Array<any>>();
    this.cart = new BehaviorSubject<Array<any>>([]);

    this.wishlist = new BehaviorSubject<Array<any>>([]);

    // tslint:disable-next-line:variable-name
    this.user.subscribe(_user => {
      // const nextCart = [];
      // _user.cart.forEach(product => nextCart.push());
      // console.log('Next user:', _user);
      this.cart.next(_user.cart);
    });
    // tslint:disable-next-line:variable-name
    this.user.subscribe(_user => this.wishlist.next(_user.wishlist));
  }

  private usersApi = '/api/users';
  private cartsApi = '/api/carts';
  private wishlistsApi = '/api/wishlists';

  user;
  users;
  cart;
  wishlist;

  // Error handling
  private static error(error: any): void {
    const message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

  getUsers(): Promise<any> {
    // @ts-ignore
    // tslint:disable-next-line:variable-name max-line-length
    return this.httpClient.get(this.usersApi).toPromise().then(_users => {
      this.users.next(_users);
      return _users;
    }).catch(UsersService.error);

  }

  getUserById(id): Promise<any> {
    if (!id) {
      this.user.next({});
      return new Promise<any>(((resolve, reject) => (resolve({}))));
    }
    const nextUser = {};
    // tslint:disable-next-line:variable-name
    return this.httpClient.get(`${this.usersApi}/${id}`).toPromise().then(_user => {
      this.user.next(_user);
      // console.log(_user);
      // tslint:disable-next-line:forin
      for (const userKey in _user) {
        // console.log(userKey);
        nextUser[userKey] = _user[userKey];
      }
      // console.log('nextUser:', nextUser);
    }).catch(UsersService.error);
    // console.log('nextUser:', nextUser);
    // this.user.next(nextUser);
  }

  putUser(id, user): Promise<any> {
    // tslint:disable-next-line:variable-name
    return this.httpClient.put(`${this.usersApi}/${id}`, user).toPromise().then(_user => {
      this.user.next(_user);
    }).catch(UsersService.error);
  }

  getCart(id): Promise<Array<any>> {
    // let nextCart;
    // tslint:disable-next-line:variable-name
    return this.getUserById(id).then(_user => {
      this.cart.next(_user);
      return _user;
    });
    // tslint:disable-next-line:variable-name
    // const userSub = this.user.subscribe(_user => nextCart = _user.cart);
    // userSub.unsubscribe();
    // this.cart.next(nextCart);
    // return nextCart;
  }

  postCart(userId, productId): Promise<Array<any>> {
    // @ts-ignore
    // tslint:disable-next-line:max-line-length variable-name
    return this.httpClient.post(`${this.cartsApi}/${userId}/${productId}`).toPromise().then(_cart => {
      this.cart.next(_cart);
      return _cart;
    });
  }

  putCart(userId, productId): void {
    return;
  }

  deleteCart(userId, productId): Promise<Array<any>> {
    // const nextCart = [];
    // @ts-ignore
    // tslint:disable-next-line:variable-name
    return this.httpClient.delete(`${this.cartsApi}/${userId}/${productId}`).toPromise().then(_cart => {
      this.cart.next(_cart);
      return _cart;
    }).catch(UsersService.error);
    // return this.cart;
  }

  getWishlist(id): Promise<Array<any>> {
    // let nextWishlist;
    // tslint:disable-next-line:variable-name
    return this.getUserById(id).then(_user => {
      this.wishlist.next(_user.wishlist);
      return _user.wishList;
    });
  }

  postWishlist(userId, productId): void {
    // @ts-ignore
    // tslint:disable-next-line:max-line-length variable-name
    return this.httpClient.post(`${this.wishlistsApi}/${userId}/${productId}`).toPromise().then(_wishlist => {
      this.wishlist.next(_wishlist);
      return _wishlist;
    });
  }

  deleteWishlist(userId, productId): void {
    // throw new Error('unimplemented');
    // @ts-ignore
    // tslint:disable-next-line:variable-name
    return this.httpClient.delete(`${this.wishlistsApi}/${userId}/${productId}`).toPromise().then(_wishlist => {
      this.wishlist.next(_wishlist);
      return _wishlist;
    }).catch(UsersService.error);
  }

  manualUpdate(): void {
    throw new Error('unimplemented');
  }
}
