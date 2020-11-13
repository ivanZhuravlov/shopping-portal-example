import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input() products = [];
  @Input() displayType = '';
  @Input() userType = '';
  @Input() parent = '';

  constructor(private ps: ProductsService, private auth: AuthService) { }

  ngOnInit(): void {
    if (this.displayType === 'all' && !this.products.length) {
      this.getProducts();
    }
    // if (!this.userType) {
    //   this.userType = this.auth.user.type || '';
    // }
  }

  getProducts(): void {
    this.ps.get().then(prods => this.products = prods);
  }

}
