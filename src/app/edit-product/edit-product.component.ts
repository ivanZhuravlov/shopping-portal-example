/* tslint:disable:max-line-length */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private ps: ProductsService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: [''],
      brand: ['']
    });
    this.failedEdit = false;
    this.displayType = 'none';
  }

  title = 'edit-product';

  form: FormGroup;
  failedEdit;
  successfulEdit;
  productId;
  productName;
  productBrand;

  displayType;

  paramsSub;

  ngOnInit(): void {
    this.paramsSub = this.route.queryParams.subscribe(params => {
      this.productId = params.productId || this.routeToAdminPortal();
      this.ps.getById(this.productId).then(product => {
        this.productName = product.name;
        this.productBrand = product.brand;
      });
    });
  }

  submitEditProductForm(): void {
    this.failedEdit = false;
    this.successfulEdit = false;
    if (this.form.valid) {
      const editFormVal = this.form.getRawValue();
      const productUpdate = {};
      for (const editProp in editFormVal) {
        if (editFormVal[editProp]) {
          productUpdate[editProp] = editFormVal[editProp];
        }
      }
      console.log(editFormVal);
      console.log(productUpdate);
      this.ps.putProduct(this.productId, productUpdate).then(product => {
        if (!product) {
          this.failedEdit = true;
          this.successfulEdit = false;
        } else {
          this.successfulEdit = true;
          this.failedEdit = false;
          // this.routeToAdminPortal();
        }
      });
    }
  }

  routeToAdminPortal(): void {
    this.router.navigate(['/admin'], { queryParams: { trigger: 'EDIT-USER' } });
  }

}
