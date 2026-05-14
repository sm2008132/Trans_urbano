import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-dark-secondary rounded-lg shadow-2xl p-8 fade-in">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">TransUrbano</h1>
            <p class="text-text-secondary">Chat en Tiempo Real</p>
          </div>

          <form (ngSubmit)="onLogin()" class="space-y-4">
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

            <button
              type="submit"
              [disabled]="loading"
              class="w-full bg-accent text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-red-600 disabled:opacity-50"
            >
              {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-text-secondary">
              ¿No tienes cuenta?
              <a (click)="goToRegister()" class="text-accent cursor-pointer hover:text-red-400 font-semibold">
                Registrate
              </a>
            </p>
          </div>

          <div *ngIf="error" class="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {{ error }}
          </div>
        </div>

        <div class="mt-8 text-center text-text-secondary text-sm">
          © 2026 TransUrbano. Todos los derechos reservados.
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/chat']);
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Email o contraseña inválidos';
        console.error('Login error:', error);
      },
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
