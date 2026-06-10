import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../../Services/sale';

@Component({
  selector: 'app-sale-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatOptionModule,
    MatTableModule, MatIconModule
  ],
  templateUrl: './sale-dialog.html',
  styleUrls: ['./sale-dialog.css']
})
export class SaleDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SaleDialogComponent>);
  private saleService = inject(SaleService);

  form!: FormGroup;
  clients: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  productSearch = '';
  saleDetails: any[] = [];
  detailColumns = ['code', 'name', 'quantity', 'unitSalePrice', 'total', 'remove'];

  voucherTypes = [
    { id: 1, description: 'SIN DOCUMENTO' },
    { id: 2, description: 'BOLETA' },
    { id: 3, description: 'FACTURA' }
  ];

  readonly IGV_RATE = 0.18;

  ngOnInit(): void {
    this.form = this.fb.group({
      voucherNumber:         ['', Validators.required],
      observation:           [''],
      voucherDocumentTypeId: ['', Validators.required],
      warehouseId:           [1],
      clientId:              ['', Validators.required]
    });
    this.loadClients();
    this.loadProducts();
  }

  loadClients(): void {
    this.saleService.getClients().subscribe({
      next: (res: any) => this.clients = res.data?.items ?? res.items ?? []
    });
  }

  loadProducts(): void {
    this.saleService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data?.items ?? res.items ?? [];
        this.filteredProducts = this.products;
      }
    });
  }

  filterProducts(): void {
    const q = this.productSearch.toLowerCase().trim();
    if (!q) {
      this.filteredProducts = [];
      return;
    }
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.includes(q)
    );
  }

  addProduct(product: any): void {
    const existing = this.saleDetails.find(d => d.productId === product.productId);
    if (existing) {
      existing.quantity++;
      existing.total = +(existing.quantity * existing.unitSalePrice).toFixed(2);
    } else {
      this.saleDetails = [...this.saleDetails, {
        productId:     product.productId,
        code:          product.code,
        name:          product.name,
        quantity:      1,
        unitSalePrice: product.sellPrice,
        total:         product.sellPrice
      }];
    }
    this.productSearch = '';
    this.filteredProducts = [];
  }

  updateTotal(detail: any): void {
    detail.quantity = Math.max(1, detail.quantity);
    detail.total = +(detail.quantity * detail.unitSalePrice).toFixed(2);
  }

  removeDetail(detail: any): void {
    this.saleDetails = this.saleDetails.filter(d => d.productId !== detail.productId);
  }

  get subTotal(): number {
    return +this.saleDetails.reduce((sum, d) => sum + d.total, 0).toFixed(2);
  }

  get igv(): number {
    return +(this.subTotal * this.IGV_RATE).toFixed(2);
  }

  get totalAmount(): number {
    return +(this.subTotal + this.igv).toFixed(2);
  }

  save(): void {
    if (this.form.invalid || this.saleDetails.length === 0) return;
    const payload = {
      ...this.form.value,
      subTotal:    this.subTotal,
      igv:         this.igv,
      totalAmount: this.totalAmount,
      saleDetails: this.saleDetails.map(d => ({
        productId:     d.productId,
        quantity:      d.quantity,
        unitSalePrice: d.unitSalePrice,
        total:         d.total
      }))
    };
    this.dialogRef.close(payload);
  }

  cancel(): void { this.dialogRef.close(null); }
}