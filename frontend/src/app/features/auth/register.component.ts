import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-dark-secondary rounded-lg shadow-2xl p-8 fade-in">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">TransUrbano</h1>
            <p class="text-text-secondary">Crear Nueva Cuenta</p>
          </div>

          <form (ngSubmit)="onRegister()" class="space-y-4">
            <div>
              <label class="block text-text-primary text-sm font-semibold mb-2">Usuario</label>
              <input
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="tu_usuario"
                class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <div>
              <label class="block text-text-primary text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <div>
              <label class="block text-text-primary text-sm font-semibold mb-2">Contraseña</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <div>
              <label class="block text-text-primary text-sm font-semibold mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>

            <button
              type="submit"
              [disabled]="loading"
              class="w-full bg-accent text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-red-600 disabled:opacity-50"
            >
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-text-secondary">
              ¿Ya tienes cuenta?
              <a (click)="goToLogin()" class="text-accent cursor-pointer hover:text-red-400 font-semibold">
                Inicia Sesión
              </a>
            </p>
          </div>

          <div *ngIf="error" class="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.router.navigate(['/chat']);
          },
          error: (error) => {
            this.loading = false;
            this.error = 'Error al iniciar sesión después del registro';
          },
        });
      },
      error: (error) => {
        this.loading = false;
        this.error = 'El email o usuario ya está registrado';
        console.error('Register error:', error);
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
