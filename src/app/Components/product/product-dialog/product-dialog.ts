import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ProductService } from '../../../Services/product';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './product-dialog.html',
  styleUrls: ['./product-dialog.css']
})
export class ProductDialogComponent implements OnInit {
  form!: FormGroup;
  categories: any[] = [];
  providers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code:       [this.data?.code      ?? '', Validators.required],
      name:       [this.data?.name      ?? '', Validators.required],
      stock:      [this.data?.stock     ?? 0,  [Validators.required, Validators.min(0)]],
      sellPrice:  [this.data?.sellPrice ?? 0,  [Validators.required, Validators.min(0)]],
      categoryId: [this.data?.categoryId ?? '', Validators.required],
      providerId: [this.data?.providerId ?? '', Validators.required],
      state:      [this.data?.state     ?? 1,  Validators.required]
    });

    this.loadCategories();
    this.loadProviders();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data ?? res ?? [];
      },
      error: () => this.categories = []
    });
  }

  loadProviders(): void {
    this.productService.getProviders().subscribe({
      next: (res: any) => {
        this.providers = res.data?.items ?? res.items ?? [];
      },
      error: () => this.providers = []
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}