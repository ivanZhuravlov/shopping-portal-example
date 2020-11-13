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
      error.status ? `${error.status} - ${error.statusText}` : 'Server request error';
    console.error(message);
  }

  get(): Promise<Array<any>> {
    // const nextProducts = [];
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    // this.httpClient.get(this.productsApi).toPromise().then(prods => prods.forEach(prod => nextProducts.push(prod))).catch(ProductsService.error);

    // this.products.next(nextProducts);

    return this.httpClient.get(this.productsApi).toPromise().then(prods => {
      this.products.next(prods);
      return prods;
    }).catch(ProductsService.error);
  }

  getById(id): Promise<any> {
    this.product = {_id: '', name: '', brand: ''};
    return this.httpClient.get(`${this.productsApi}/${id}`).toPromise().then(prod => prod).catch(ProductsService.error);
  }

  postProduct(newProduct): Promise<any> {
    return this.httpClient.post(this.productsApi, newProduct).toPromise().then(prod => {
      this.product = prod;
      this.get();
      return prod;
    }).catch(ProductsService.error);
  }

  putProduct(id, updatedProduct): Promise<any> {
    return this.httpClient.put(`${this.productsApi}/${id}`, updatedProduct).toPromise().then(prod => {
      this.product = prod;
      this.get();
      return prod;
    }).catch(ProductsService.error);
  }

  deleteProduct(id): Promise<any> {
    return this.httpClient.delete(`${this.productsApi}/${id}`).toPromise().then(prodId => {
      this.get();
      return prodId;
    }).catch(ProductsService.error);
  }
}
