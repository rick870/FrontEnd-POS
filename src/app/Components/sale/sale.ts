import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { SaleService } from '../../Services/sale';
import { SaleDialogComponent } from './sale-dialog/sale-dialog';
import { SaleDetailDialogComponent } from './sale-detail-dialog/sale-detail-dialog';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule,
    MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule,
    MatDialogModule, MatSnackBarModule,
    MatTooltipModule, MatChipsModule,
    MatSelectModule, MatOptionModule
  ],
  templateUrl: './sale.html',
  styleUrls: ['./sale.css']
})
export class SaleComponent implements OnInit {
  private saleService = inject(SaleService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns = ['voucherNumber', 'voucherDescription', 'client', 'dateOfSale', 'totalAmount', 'actions'];
  sales: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  textFilter = '';
  stateFilter = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getList({
      NumPage: this.currentPage + 1,
      NumRecordsPage: this.pageSize,
      TextFilter: this.textFilter,
      NumFilter: this.textFilter ? 1 : undefined
    }).subscribe({
      next: (res: any) => {
        this.sales = res.data?.items ?? res.items ?? [];
        this.totalRecords = res.data?.totalRecords ?? res.totalRecords ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Error al cargar ventas', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSales();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadSales();
  }

  openNewSale(): void {
    const ref = this.dialog.open(SaleDialogComponent, {
      width: '900px',
      maxWidth: '98vw',
      disableClose: true,
      data: null
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.saleService.create(result).subscribe({
        next: () => { this.showSnack('Venta registrada'); this.loadSales(); },
        error: () => this.showSnack('Error al registrar venta', 'error')
      });
    });
  }

 viewDetail(sale: any): void {
    this.saleService.getById(sale.saleId).subscribe({
      next: (res: any) => {
        const detail = res.data ?? res;
        detail.voucherDescription = sale.voucherDescription;
        detail.clientName = sale.client; // ← agrega el nombre del cliente
        this.dialog.open(SaleDetailDialogComponent, {
          width: '1100px',
          maxWidth: '95vw',
          data: detail
        });
      },
      error: () => this.showSnack('Error al cargar detalle', 'error')
    });
  }

  cancelSale(sale: any): void {
    if (!confirm(`¿Cancelar la venta "${sale.voucherNumber}"?`)) return;
    this.saleService.cancel(sale.saleId).subscribe({
      next: () => { this.showSnack('Venta cancelada'); this.loadSales(); },
      error: () => this.showSnack('Error al cancelar', 'error')
    });
  }

  private showSnack(msg: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'error' ? ['snack-error'] : ['snack-success']
    });
  }
}