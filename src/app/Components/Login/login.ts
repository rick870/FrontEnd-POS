import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../Services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;
    this.error = '';
    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.isSuccess && res.data) {
          this.authService.saveToken(res.data);
          this.router.navigate(['/categories']);
        } else {
          this.error = res.message || 'Usuario o contraseña incorrectos.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo conectar con el servidor.';
      }
    });
  }
}