import { Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Services/product';
import { ProductDialogComponent } from './product-dialog/product-dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['code', 'name', 'category', 'provider', 'stock', 'sellPrice', 'state', 'actions'];
  products: any[] = [];
  totalRecords = 0;
  pageSize = 5;
  currentPage = 0;
  textFilter = '';
  stateFilter = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getList({
      numPage: this.currentPage + 1,
      numRecordsPage: this.pageSize,
      textFilter: this.textFilter,
      stateFilter: this.stateFilter
    }).subscribe({
      next: (res: any) => {
        this.products = res.data?.items ?? res.items ?? [];
        this.totalRecords = res.data?.totalRecords ?? res.totalRecords ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Error al cargar productos', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  openDialog(product: any = null): void {
    const ref = this.dialog.open(ProductDialogComponent, {
      width: '560px',
      data: product,
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (product) {
        this.productService.edit(product.productId, result).subscribe({
          next: () => { this.showSnack('Producto actualizado'); this.loadProducts(); },
          error: () => this.showSnack('Error al actualizar', 'error')
        });
      } else {
        this.productService.create(result).subscribe({
          next: () => { this.showSnack('Producto registrado'); this.loadProducts(); },
          error: () => this.showSnack('Error al registrar', 'error')
        });
      }
    });
  }

  removeProduct(product: any): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    this.productService.remove(product.productId).subscribe({
      next: () => { this.showSnack('Producto eliminado'); this.loadProducts(); },
      error: () => this.showSnack('Error al eliminar', 'error')
    });
  }

  private showSnack(msg: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['snack-error'] : ['snack-success']
    });
  }
}