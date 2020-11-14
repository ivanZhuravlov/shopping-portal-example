import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  constructor(private readonly fb: FormBuilder, private auth: AuthService, private router: Router, private ps: ProductsService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]]
    });
    this.failedCreation = false;
    this.successfulCreation = false;
  }

  title = 'create-product';

  form: FormGroup;
  failedCreation;
  successfulCreation;

  ngOnInit(): void {
  }

  submitCreationForm(): void {
    if (this.form.valid) {
      this.ps.postProduct(this.form.getRawValue()).then(product => {
        if (!product) {
          console.log(product);
          this.failedCreation = true;
          this.successfulCreation = false;
        } else {
          this.successfulCreation = true;
          this.failedCreation = false;
        }
      });
    }

  }

}
