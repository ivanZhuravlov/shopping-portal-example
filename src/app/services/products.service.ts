import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) {
    this.products = new BehaviorSubject<Array<any>>([]);
  }

  private productsApi = '/api/products';

  products;
  product;

  // Error handling
  private static error(error: any): void {
    const message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(message);
  }

  get(): Array<any> {
    const nextProducts = [];
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    this.httpClient.get(this.productsApi).toPromise().then(prods => prods.forEach(prod => nextProducts.push(prod))).catch(ProductsService.error);

    this.products.next(nextProducts);

    return nextProducts;
    // this.httpClient.get(this.productsApi).toPromise().then(prods => prods.).catch(ProductsService.error);
  }

  getById(id): Promise<any> {
    this.product = {_id: '', name: '', brand: ''};
    return this.httpClient.get(`${this.productsApi}/${id}`).toPromise().then(prod => prod).catch(ProductsService.error);
}
}
