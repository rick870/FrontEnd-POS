import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../Services/user';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.css'
})
export class UserDialogComponent {
  form: FormGroup;
  loading = false;
  selectedImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDialogComponent>
  ) {
    this.form = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      Email: ['', [Validators.required, Validators.email]],
      State: [1, Validators.required]
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;

    const payload = {
      ...this.form.value,
      Image: this.selectedImage
    };

    this.userService.register(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.dialogRef.close(this.form.value); // ← devuelve datos al componente padre
        } else {
          this.loading = false;
        }
      },
      error: () => this.loading = false
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}