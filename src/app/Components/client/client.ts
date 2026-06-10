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
import { ClientService } from '../../Services/client';
import { ClientDialogComponent } from './client-dialog/client-dialog';

@Component({
  selector: 'app-client',
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
  templateUrl: './client.html',
  styleUrls: ['./client.css']
})
export class ClientComponent implements OnInit {
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'email', 'documentType', 'documentNumber', 'phone', 'state', 'actions'];
  clients: any[] = [];
  totalRecords = 0;
  pageSize = 5;
  currentPage = 0;
  textFilter = '';
  stateFilter = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clientService.getList({
      numPage: this.currentPage + 1,
      numRecordsPage: this.pageSize,
      textFilter: this.textFilter,
      stateFilter: 1  // ← fijo, solo activos
    }).subscribe({
      next: (res: any) => {
        this.clients = res.data?.items ?? res.items ?? [];
        this.totalRecords = res.data?.totalRecords ?? res.totalRecords ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Error al cargar clientes', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClients();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadClients();
  }

  openDialog(client: any = null): void {
    const ref = this.dialog.open(ClientDialogComponent, {
      width: '520px',
      data: client,
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (client) {
        this.clientService.edit(client.clientId, result).subscribe({
          next: () => { this.showSnack('Cliente actualizado'); this.loadClients(); },
          error: () => this.showSnack('Error al actualizar', 'error')
        });
      } else {
        this.clientService.create(result).subscribe({
          next: () => { this.showSnack('Cliente registrado'); this.loadClients(); },
          error: () => this.showSnack('Error al registrar', 'error')
        });
      }
    });
  }

  removeClient(client: any): void {
    if (!confirm(`¿Eliminar a "${client.name}"?`)) return;
    this.clientService.remove(client.clientId).subscribe({
      next: () => { this.showSnack('Cliente eliminado'); this.loadClients(); },
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