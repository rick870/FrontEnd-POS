import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserDialogComponent } from './user-dialog/user-dialog';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {
  users: any[] = [];
  displayedColumns = ['#', 'UserName', 'Email', 'State'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef  // ← agregado
  ) {}

  openNewUser(): void {
    const ref = this.dialog.open(UserDialogComponent, {
      width: '500px',
      disableClose: true
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.users = [...this.users, result];
        this.cdr.detectChanges(); // ← fuerza actualización
        this.snackBar.open('Usuario registrado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }
}