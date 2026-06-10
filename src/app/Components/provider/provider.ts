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
import { FormsModule } from '@angular/forms';
import { ProviderService } from '../../Services/provider';
import { ProviderResponse } from '../../Interfaces/provider';
import { ProviderDialogComponent } from './provider-dialog/provider-dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // ← agrega este

@Component({
  selector: 'app-provider',
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
  templateUrl: './provider.html',
  styleUrls: ['./provider.css']
})
export class ProviderComponent implements OnInit {
  private providerService = inject(ProviderService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'email', 'documentType', 'documentNumber', 'phone', 'state', 'actions'];
  providers: ProviderResponse[] = [];
  totalRecords = 0;
  pageSize = 5;
  currentPage = 0;
  textFilter = '';
  isLoading = false;

  ngOnInit(): void {
    this.loadProviders();
  }

  stateFilter = 1;

  loadProviders(): void {
    this.isLoading = true;
    this.providerService.getList({
      numPage: this.currentPage + 1,
      numRecordsPage: this.pageSize,
      textFilter: this.textFilter,
      stateFilter: this.stateFilter 
    }).subscribe({
      next: (res) => {
        this.providers = res.data.items;        // ← res.data.items
        this.totalRecords = res.data.totalRecords; // ← res.data.totalRecords
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Error al cargar proveedores', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProviders();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProviders();
  }

  openDialog(provider: ProviderResponse | null = null): void {
    const ref = this.dialog.open(ProviderDialogComponent, {
      width: '520px',
      data: provider,
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (provider) {
        this.providerService.edit(provider.providerId, result).subscribe({
          next: () => { this.showSnack('Proveedor actualizado'); this.loadProviders(); },
          error: () => this.showSnack('Error al actualizar', 'error')
        });
      } else {
        this.providerService.create(result).subscribe({
          next: () => { this.showSnack('Proveedor registrado'); this.loadProviders(); },
          error: () => this.showSnack('Error al registrar', 'error')
        });
      }
    });
  }

  removeProvider(provider: ProviderResponse): void {
    if (!confirm(`¿Eliminar a "${provider.name}"?`)) return;
    this.providerService.remove(provider.providerId).subscribe({
      next: () => { this.showSnack('Proveedor eliminado'); this.loadProviders(); },
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