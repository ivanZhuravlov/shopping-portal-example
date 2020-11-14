import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor(private ps: ProductsService) {}

  @Input() products = [];
  @Input() displayType = '';
  @Input() parent = '';

  ngOnInit(): void {
    if (this.displayType === 'all' && !this.products.length) {
      this.getProducts();
    }
  }

  getProducts(): void {
    this.ps.getProducts().then(prods => this.products = prods);
  }

}
