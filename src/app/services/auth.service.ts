/* tslint:disable:variable-name */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  private KEY = 'fashionista-auth';
  private TYPE_KEY = 'fashionista-auth-type';
  private NAME_KEY = 'fashionista-auth-name';
  private TTL = 1000 * 60 * 10;
  private API_PORT = environment.apiPort;

  private authApiForced = `http://localhost:${this.API_PORT}/api/auth`;
  private authApi = '/api/auth';

  private currentUser = {};
  private loggedInStatus = false;

  get user(): any {
    const _id = this.getWithExpiry(this.KEY);
    const type = this.getWithExpiry(this.TYPE_KEY);
    const name = this.getWithExpiry(this.NAME_KEY);
    return (_id && type && name) ? { _id, name, type } : {};
  }

  get loggedIn(): boolean {
    return !!this.getWithExpiry(this.KEY);
  }

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

  login(user): Promise<boolean> {
    const { name, password } = user;
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => reject('No response.'), 10000);
      if (name && password) {
        resolve(this.authUser({ name, password }));
      } else {
        resolve(false);
      }
    });
  }

  authUser(user): Promise<boolean> {
    const { name, password } = user;
    // @ts-ignore
    return this.httpClient.post(this.authApi, { name, password }).toPromise().then(({ _id, type, error }) => {
      if (error) {
        console.log(error);
        return false;
      } else {
        this.currentUser = { _id, name: user.name, type };
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

}
