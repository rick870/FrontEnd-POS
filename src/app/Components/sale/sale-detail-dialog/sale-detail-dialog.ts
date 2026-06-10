import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sale-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './sale-detail-dialog.html',
  styleUrls: ['./sale-detail-dialog.css']
})
export class SaleDetailDialogComponent {
  displayedColumns = ['code', 'name', 'quantity', 'unitSalePrice', 'totalAmount'];

  constructor(
    public dialogRef: MatDialogRef<SaleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void { this.dialogRef.close(); }
}