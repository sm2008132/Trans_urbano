import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { CommunitiesService, Community } from '../../core/services/communities.service';

@Component({
  selector: 'app-create-community-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
      <div class="bg-dark-secondary rounded-lg shadow-2xl p-8 w-full max-w-md m-4 slide-up">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Crear Comunidad</h2>
          <button (click)="onClose()" class="text-text-secondary hover:text-white transition">
            ✕
          </button>
        </div>

        <form (ngSubmit)="onCreateCommunity()" class="space-y-4">
          <div>
            <label class="block text-text-primary text-sm font-semibold mb-2">Nombre de la Comunidad</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              placeholder="Mi Comunidad"
              class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
            />
          </div>

          <div>
            <label class="block text-text-primary text-sm font-semibold mb-2">Descripción (Opcional)</label>
            <textarea
              [(ngModel)]="description"
              name="description"
              placeholder="Descripción de la comunidad..."
              rows="3"
              class="w-full px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-none"
            ></textarea>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              (click)="onClose()"
              class="flex-1 px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-dark-secondary transition font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="loading || !name.trim()"
              class="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition font-semibold"
            >
              {{ loading ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </form>

        <div *ngIf="error" class="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CreateCommunityModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Community>();

  name = '';
  description = '';
  loading = false;
  error = '';

  constructor(private communitiesService: CommunitiesService) {}

  onClose(): void {
    this.close.emit();
  }

  onCreateCommunity(): void {
    if (!this.name.trim()) {
      this.error = 'El nombre de la comunidad es requerido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.communitiesService.create(this.name, this.description).subscribe({
      next: (community) => {
        this.loading = false;
        this.create.emit(community);
        this.name = '';
        this.description = '';
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al crear la comunidad';
        console.error('Create community error:', error);
      },
    });
  }
}
