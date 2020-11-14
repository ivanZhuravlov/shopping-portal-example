import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

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

  getProducts(): Promise<Array<any>> {
    // @ts-ignore
    return this.httpClient.get(this.productsApi).toPromise().then((prods: Array<any>) => {
      this.products.next(prods);
      return prods;
    }).catch(ProductsService.error);
  }

  getById(id): Promise<any> {
    this.product = { _id: '', name: '', brand: '' };
    return this.httpClient.get(`${this.productsApi}/${id}`).toPromise().then(prod => prod).catch(ProductsService.error);
  }

  postProduct(newProduct): Promise<any> {
    return this.httpClient.post(this.productsApi, newProduct).toPromise().then(prod => {
      this.product = prod;
      this.getProducts();
      return prod;
    }).catch(ProductsService.error);
  }

  putProduct(id, updatedProduct): Promise<any> {
    return this.httpClient.put(`${this.productsApi}/${id}`, updatedProduct).toPromise().then(prod => {
      this.product = prod;
      this.getProducts();
      return prod;
    }).catch(ProductsService.error);
  }

  deleteProduct(id): Promise<any> {
    return this.httpClient.delete(`${this.productsApi}/${id}`).toPromise().then(prodId => {
      this.getProducts();
      return prodId;
    }).catch(ProductsService.error);
  }
}
