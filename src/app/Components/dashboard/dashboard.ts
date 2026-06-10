import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../Services/sale';
import { ClientService } from '../../Services/client';
import { ProductService } from '../../Services/product';
import { ProviderService } from '../../Services/provider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private providerService = inject(ProviderService);
  private cdr = inject(ChangeDetectorRef);

  // Filtros de fecha
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDate: Date = new Date();

  // KPIs
  totalSales = 0;
  totalAmount = 0;
  totalClients = 0;
  totalProducts = 0;
  totalProviders = 0;

  // Últimas ventas
  lastSales: any[] = [];
  saleColumns = ['voucherNumber', 'voucherDescription', 'client', 'totalAmount', 'dateOfSale'];

  // Gráfico de torta por tipo comprobante
  voucherStats: { label: string; count: number; percentage: number; color: string }[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.loadKPIs();
    this.loadSales();
  }

  loadKPIs(): void {
    // Total clientes activos
    this.clientService.getList({
      numPage: 1, numRecordsPage: 1,
      textFilter: '', stateFilter: 1
    }).subscribe({
      next: (res: any) => {
        this.totalClients = res.data?.totalRecords ?? 0;
        this.cdr.detectChanges();
      }
    });

    // Total productos activos
    this.productService.getList({
      numPage: 1, numRecordsPage: 1,
      textFilter: '', stateFilter: 1
    }).subscribe({
      next: (res: any) => {
        this.totalProducts = res.data?.totalRecords ?? 0;
        this.cdr.detectChanges();
      }
    });

    // Total proveedores activos
    this.providerService.getList({
      numPage: 1, numRecordsPage: 1,
      textFilter: '', stateFilter: 1
    }).subscribe({
      next: (res: any) => {
        this.totalProviders = res.data?.totalRecords ?? 0;
        this.cdr.detectChanges();
      }
    });
  }

  loadSales(): void {
    const start = this.formatDate(this.startDate);
    const end = this.formatDate(this.endDate);

    this.saleService.getList({
      NumPage: 1,
      NumRecordsPage: 100,
      TextFilter: '',
      StartDate: start,
      EndDate: end
    }).subscribe({
      next: (res: any) => {
        const items = res.data?.items ?? [];
        this.totalSales = res.data?.totalRecords ?? 0;
        this.totalAmount = items.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
        this.lastSales = items.slice(0, 5);
        this.buildVoucherChart(items);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; }
    });
  }

  buildVoucherChart(sales: any[]): void {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2'];
    const groups: { [key: string]: number } = {};

    sales.forEach(s => {
      const key = s.voucherDescription ?? 'SIN DOCUMENTO';
      groups[key] = (groups[key] ?? 0) + 1;
    });

    const total = sales.length || 1;
    this.voucherStats = Object.entries(groups).map(([label, count], i) => ({
      label,
      count,
      percentage: Math.round((count / total) * 100),
      color: colors[i % colors.length]
    }));
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onFilter(): void {
    this.loadSales();
  }

  getOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset -= this.voucherStats[i].percentage * 4.4;
    }
    return offset;
  }
}