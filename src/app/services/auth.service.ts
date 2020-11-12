import {Injectable} from '@angular/core';
import {UsersService} from './users.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get user(): any {
    // tslint:disable-next-line:variable-name
    const _id = this.getWithExpiry(this.KEY);
    const type = this.getWithExpiry(this.TYPE_KEY);
    const name = this.getWithExpiry(this.NAME_KEY);
    return (_id && type && name) ? {_id, name, type} : {};
    if (this.loggedInStatus && this.getWithExpiry(this.KEY)) {
      return this.currentUser;
    } else {
      this.logout();
      return this.currentUser;
    }
  }

  // get cart(): Array<any> {
  //   if (this.loggedInStatus && this.getWithExpiry(this.KEY)) {
  //     // @ts-ignore
  //     return this.currentUser.cart;
  //   } else {
  //     this.logout();
  //     return [];
  //   }
  // }

  // get wishlist(): Array<any> {
  //   if (this.loggedInStatus && this.getWithExpiry(this.KEY)) {
  //     // @ts-ignore
  //     return this.currentUser.wishlist;
  //   } else {
  //     this.logout();
  //     return [];
  //   }
  // }

  get loggedIn(): boolean {
    return !!this.getWithExpiry(this.KEY);
    this.loggedInStatus = this.loggedInStatus && !!this.getWithExpiry(this.KEY);
    return this.loggedInStatus;
  }

  constructor(private httpClient: HttpClient) {
  }

  private KEY = 'fashionista-auth';
  private TYPE_KEY = 'fashionista-auth-type';
  private NAME_KEY = 'fashionista-auth-name';
  private TTL = 1000 * 60 * 10;
  private authApi = '/api/auth';

  private currentUser = {};
  private loggedInStatus = false;

  // Error handling
  private static error(error: any): void {
    const message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Auth server error';
    console.error(message);
  }

  private static setWithExpiry(key, value, ttl): void {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  private static remove(key): boolean {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return false;
    }
    localStorage.removeItem(key);

    return true;
  }

  login(user): Promise<boolean> {
    const {name, password} = user;
    // console.log('authenticating login...');
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => reject('No response.'), 10000);
      if (name && password) {
        resolve(this.authUser({name, password}));
      } else {
        resolve(false);
      }
    });

    // // console.log(user);
    // const { _id, name, type } = user;
    // if (_id && name && type) {
    //   this.currentUser = { _id, name, type };
    //   // @ts-ignore
    //   // if (!this.currentUser.cart) { this.currentUser.cart = []; }
    //   // @ts-ignore
    //   // if (!this.currentUser.wishlist) { this.currentUser.wishlist = []; }
    //   this.remove(this.KEY);
    //   this.setWithExpiry(this.KEY, user._id, this.TTL);
    // }
    // return this.currentUser;
  }

  authUser(user): Promise<boolean> {
    const {name, password} = user;
    // @ts-ignore
    return this.httpClient.post(this.authApi, {name, password}).toPromise().then(({_id, type, error}) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        // console.log('saving user');
        this.currentUser = {_id, name: user.name, type};
        AuthService.remove(this.KEY);
        AuthService.setWithExpiry(this.KEY, _id, this.TTL);
        AuthService.remove(this.TYPE_KEY);
        AuthService.setWithExpiry(this.TYPE_KEY, type, this.TTL);
        AuthService.remove(this.NAME_KEY);
        AuthService.setWithExpiry(this.NAME_KEY, name, this.TTL);
        return true;
      }
    }).catch(AuthService.error);
  }

  logout(): void {
    AuthService.remove(this.KEY);
    AuthService.remove(this.TYPE_KEY);
    AuthService.remove(this.NAME_KEY);
    this.currentUser = {};
    this.loggedInStatus = false;
  }

  private getWithExpiry(key): number {
    const itemStr = localStorage.getItem(key);

    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    localStorage.removeItem(key);

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      return null;
    } else {
      AuthService.setWithExpiry(key, item.value, this.TTL);
    }
    return item.value;
  }

}
