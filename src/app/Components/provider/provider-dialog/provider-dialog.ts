import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProviderService } from '../../../Services/provider';
import { DocumentType, ProviderResponse } from '../../../Interfaces/provider';

@Component({
  selector: 'app-provider-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './provider-dialog.html',
  styleUrls: ['./provider-dialog.css']
})
export class ProviderDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProviderDialogComponent>);
  public data: ProviderResponse | null = inject(MAT_DIALOG_DATA);
  private providerService = inject(ProviderService);

  form!: FormGroup;
  documentTypes = [
    { documentTypeId: 1,  name: 'DOCUMENTO NACIONAL DE IDENTIDAD', abbreviation: 'DNI' },
    { documentTypeId: 2,  name: 'CARNET DE EXTRANJERIA',            abbreviation: 'CE' },
    { documentTypeId: 3,  name: 'REGISTRO UNICO DE CONTRIBUYENTES', abbreviation: 'RUC' },
    { documentTypeId: 6,  name: 'OTROS',                            abbreviation: 'OTROS' },
    { documentTypeId: 10, name: 'PART. DE NACIMIENTO-IDENTIDAD',    abbreviation: 'P NAC' },
    { documentTypeId: 11, name: 'PASAP',                            abbreviation: 'P.S' }
  ];

  ngOnInit(): void {
    this.buildForm();
    this.loadDocumentTypes();
    if (this.data) this.patchForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name:           ['', [Validators.required, Validators.maxLength(100)]],
      email:          ['', [Validators.required, Validators.email]],
      documentTypeId: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      address:        ['', Validators.maxLength(200)],
      phone:          ['', Validators.maxLength(20)],
      state:          [1, Validators.required]
    });
  }

  loadDocumentTypes(): void {
    this.providerService.getDocumentTypes().subscribe({
      next: (types) => this.documentTypes = types,
      error: () => { /* usa el fallback definido arriba */ }
    });
  }

  patchForm(): void {
    this.form.patchValue({
      name:           this.data!.name,
      email:          this.data!.email,
      documentNumber: this.data!.documentNumber,
      address:        this.data!.address,
      phone:          this.data!.phone,
      state:          this.data!.state
    });

    // Busca por abreviatura primero, luego por nombre
    const match = this.documentTypes.find(d =>
      d.abbreviation === this.data!.documentType ||
      d.name === this.data!.documentType
    );
    if (match) this.form.patchValue({ documentTypeId: match.documentTypeId });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}