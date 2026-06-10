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
import { CategoryService } from '../../Services/category';
import { CategoryDialogComponent } from './category-dialog/category-dialog';

@Component({
  selector: 'app-category',
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
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['name', 'description', 'auditCreateDate', 'state', 'actions'];
  categories: any[] = [];
  totalRecords = 0;
  pageSize = 5;
  currentPage = 0;
  textFilter = '';
  stateFilter = 1;
  isLoading = false;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getList({
      numPage: this.currentPage + 1,
      numRecordsPage: this.pageSize,
      textFilter: this.textFilter,
      stateFilter: this.stateFilter
    }).subscribe({
      next: (res: any) => {
        this.categories = res.data?.items ?? res.items ?? [];
        this.totalRecords = res.data?.totalRecords ?? res.totalRecords ?? 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showSnack('Error al cargar categorías', 'error');
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadCategories();
  }

  openDialog(category: any = null): void {
    const ref = this.dialog.open(CategoryDialogComponent, {
      width: '480px',
      data: category,
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (category) {
        this.categoryService.edit(category.categoryId, result).subscribe({
          next: () => { this.showSnack('Categoría actualizada'); this.loadCategories(); },
          error: () => this.showSnack('Error al actualizar', 'error')
        });
      } else {
        this.categoryService.create(result).subscribe({
          next: () => { this.showSnack('Categoría registrada'); this.loadCategories(); },
          error: () => this.showSnack('Error al registrar', 'error')
        });
      }
    });
  }

  removeCategory(category: any): void {
    if (!confirm(`¿Eliminar "${category.name}"?`)) return;
    this.categoryService.remove(category.categoryId).subscribe({
      next: () => { this.showSnack('Categoría eliminada'); this.loadCategories(); },
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