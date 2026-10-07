import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../../core/layout/page-header/page-header.component';
import { RetailersService } from '../../../core/services/retailers.service';

@Component({
  selector: 'app-edit-retailer',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PageHeaderComponent],
  templateUrl: './edit-retailer.component.html'
})
export class EditRetailerComponent implements OnInit {
  form: FormGroup;
  retailerId = '';
  retailerName = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private retailersService: RetailersService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.retailerId = this.route.snapshot.paramMap.get('id') ?? '';
    this.retailersService.getRetailer(this.retailerId).subscribe(retailer => {
      this.retailerName = retailer.name;
      this.form.patchValue(retailer);
    });
  }

  goBack(): void {
    this.router.navigate(['/app/retailers']);
  }

  update(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.retailersService.updateRetailer(this.retailerId, this.form.value).subscribe(() => {
      this.router.navigate(['/app/retailers']);
    });
  }
}
