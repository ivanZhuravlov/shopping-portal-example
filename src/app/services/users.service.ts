/* tslint:disable:variable-name */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) {
    this.user = new Subject<any>();
    this.users = new Subject<Array<any>>();
    this.cart = new BehaviorSubject<Array<any>>([]);

    this.wishlist = new BehaviorSubject<Array<any>>([]);

    this.user.subscribe(_user => {
      this.cart.next(_user.cart);
    });
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
      error.status ? `${error.status} - ${error.statusText}` : 'Server request error';
    console.error(message);
  }

  getUsers(): Promise<any> {
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
    return this.httpClient.get(`${this.usersApi}/${id}`).toPromise().then(_user => {
      this.user.next(_user);
      return _user;
    }).catch(UsersService.error);
  }

  postUser(user): Promise<any> {
    return this.httpClient.post(`${this.usersApi}`, user).toPromise().then(_user => {
      this.getUsers();
      // this.getUserById(id);
      return _user;
    }).catch(UsersService.error);
  }

  putUser(id, user): Promise<any> {
    return this.httpClient.put(`${this.usersApi}/${id}`, user).toPromise().then(_user => {
      this.getUsers();
      // this.getUserById(id);
      return _user;
    }).catch(UsersService.error);
  }

  deleteUser(id): Promise<any> {
    return this.httpClient.delete(`${this.usersApi}/${id}`).toPromise().then(_id => {
      this.getUsers();
      // this.getUserById(id);
      return _id;
    }).catch(UsersService.error);
  }

  getCart(id): Promise<Array<any>> {
    return this.httpClient.get(`${this.cartsApi}/${id}`).toPromise().then((_cart: Array<any>) => {
      this.cart.next(_cart);
      return _cart;
    });
  }

  postCart(userId, productId): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.post(`${this.cartsApi}/${userId}/${productId}`).toPromise().then(_cart => {
      this.cart.next(_cart);
      return _cart;
    });
  }

  putCart(userId, productId, increment): Promise<any> {
    return this.httpClient.put(`${this.cartsApi}/${userId}/${productId}/${increment}`, {}).toPromise().then(_cart => {
      this.cart.next(_cart);
      return _cart;
    });
  }

  deleteCart(userId, productId): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.delete(`${this.cartsApi}/${userId}/${productId}`).toPromise().then(_cart => {
      this.cart.next(_cart);
      return _cart;
    }).catch(UsersService.error);
  }

  getWishlist(id): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.get(`${this.wishlistsApi}/${id}`).toPromise().then((_wishlist: Array<any>) => {
      this.wishlist.next(_wishlist);
      return _wishlist;
    }).catch(UsersService.error);
  }

  postWishlist(userId, productId): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.post(`${this.wishlistsApi}/${userId}/${productId}`).toPromise().then(_wishlist => {
      this.wishlist.next(_wishlist);
      return _wishlist;
    }).catch(UsersService.error);
  }

  deleteWishlist(userId, productId): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.delete(`${this.wishlistsApi}/${userId}/${productId}`).toPromise().then(_wishlist => {
      this.wishlist.next(_wishlist);
      return _wishlist;
    }).catch(UsersService.error);
  }

  unimplemented(direct: boolean = true): void {
    if (direct) {
      throw new Error('function not specified');
    } else {
      throw new Error('unimplemented');
    }
  }
}
