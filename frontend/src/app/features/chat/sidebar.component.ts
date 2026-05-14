import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Community } from '../../core/services/communities.service';
import { User } from '../../core/services/auth.service';
import { AvatarService } from '../../shared/services/avatar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-48 md:w-64 bg-dark-secondary border-r border-dark-tertiary flex flex-col h-full">
      <!-- Header -->
      <div class="p-2 md:p-4 border-b border-dark-tertiary">
        <h1 class="text-lg md:text-2xl font-bold text-accent mb-1">TransUrbano</h1>
        <p class="text-text-secondary text-xs md:text-sm">Chat</p>
      </div>

      <!-- User Profile -->
      <div *ngIf="currentUser" class="p-2 md:p-4 bg-dark-tertiary border-b border-dark-tertiary">
        <div class="flex items-center gap-2 md:gap-3">
          <img [src]="getAvatarUrl(currentUser.username, currentUser.avatar)" [alt]="currentUser.username" class="w-8 md:w-10 h-8 md:h-10 rounded-full flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-white font-semibold truncate text-xs md:text-sm">{{ currentUser.username }}</p>
            <p class="text-text-secondary text-xs truncate">{{ currentUser.email }}</p>
          </div>
        </div>
      </div>

      <!-- Communities Header -->
      <div class="p-2 md:p-4 flex items-center justify-between border-b border-dark-tertiary">
        <h2 class="text-text-primary font-semibold text-sm md:text-base">Comunidades</h2>
        <button
          (click)="onCreateCommunity()"
          class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent text-white flex items-center justify-center hover:bg-red-600 transition text-sm md:text-base flex-shrink-0"
          title="Crear"
        >
          +
        </button>
      </div>

      <!-- Communities List -->
      <div class="flex-1 overflow-y-auto no-scrollbar">
        <div *ngIf="(communities && communities.length === 0)" class="p-2 md:p-4 text-text-secondary text-xs text-center">
          Sin comunidades
        </div>

        <div *ngFor="let community of communities" (click)="onSelectCommunity(community)"
          [class.bg-dark-tertiary]="selectedCommunity?.id === community.id"
          class="p-2 md:p-3 cursor-pointer border-l-4 border-transparent hover:bg-dark-tertiary transition text-xs md:text-sm"
          [class.border-accent]="selectedCommunity?.id === community.id"
        >
          <div class="flex items-start gap-2">
            <div class="w-8 h-8 md:w-10 md:h-10 rounded bg-accent/20 flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-semibold text-accent">
              {{ community.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold truncate">{{ community.name }}</p>
              <p class="text-text-secondary text-xs">{{ community.memberCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-2 md:p-4 border-t border-dark-tertiary flex-shrink-0">
        <button
          (click)="onLogout()"
          class="w-full px-3 md:px-4 py-1 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-xs md:text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class SidebarComponent {
  @Input() communities: any[] | null = null;
  @Input() selectedCommunity: Community | null = null;
  @Input() currentUser: User | null = null;

  @Output() selectCommunity = new EventEmitter<Community>();
  @Output() createCommunity = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onSelectCommunity(community: Community): void {
    this.selectCommunity.emit(community);
  }

  onCreateCommunity(): void {
    this.createCommunity.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  getAvatarUrl(username: string, avatar?: string): string {
    if (avatar) {
      // Si el avatar ya es una URL válida de ui-avatars.com, devolverlo
      if (avatar.includes('ui-avatars.com')) {
        return avatar;
      }
      // Si tiene protocolo http/https, validar que sea una URL real
      if (avatar.startsWith('http')) {
        return avatar;
      }
      // Si es solamente un dominio sin protocolo (como avatar.example.com)
      // o inválido, ignorarlo y generar uno nuevo
    }
    return AvatarService.getAvatarUrl(username);
  }
}
