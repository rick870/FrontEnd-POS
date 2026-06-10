import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './client-dialog.html',
  styleUrls: ['./client-dialog.css']
})
export class ClientDialogComponent implements OnInit {
  form!: FormGroup;

  documentTypes = [
    { documentTypeId: 1, name: 'DNI' },
    { documentTypeId: 2, name: 'RUC' },
    { documentTypeId: 3, name: 'Carnet de Extranjería' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:           [this.data?.name ?? '',           [Validators.required, Validators.maxLength(100)]],
      email:          [this.data?.email ?? '',          [Validators.required, Validators.email]],
      documentTypeId: [this.data?.documentTypeId ?? '', Validators.required],
      documentNumber: [this.data?.documentNumber ?? '', [Validators.required, Validators.maxLength(20)]],
      address:        [this.data?.address ?? '',        Validators.maxLength(200)],
      phone:          [this.data?.phone ?? '',          Validators.maxLength(20)],
      state:          [this.data?.state ?? 1,           Validators.required]
    });

    if (this.data) {
      const match = this.documentTypes.find(d =>
        d.name === this.data.documentType
      );
      if (match) this.form.patchValue({ documentTypeId: match.documentTypeId });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}