import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Community } from '../../core/services/communities.service';
import { User } from '../../core/services/auth.service';
import { SocketService, ChatMessage } from '../../core/services/socket.service';
import { ApiService } from '../../core/services/api.service';
import { AvatarService } from '../../shared/services/avatar.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="selectedCommunity" class="flex-1 flex flex-col bg-dark-primary h-full">
      <!-- Header -->
      <div class="bg-dark-secondary border-b border-dark-tertiary p-3 md:p-4 flex items-center justify-between flex-shrink-0">
        <div class="min-w-0">
          <h2 class="text-lg md:text-xl font-bold text-white truncate">{{ selectedCommunity.name }}</h2>
          <p class="text-text-secondary text-xs md:text-sm">{{ selectedCommunity.memberCount }} miembros</p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-2">
          <span *ngIf="userTyping$ | async as username" class="text-accent text-xs md:text-sm italic hidden md:inline">
            {{ username }} escribe...
          </span>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-dark-primary min-h-0" #messagesContainer>
        <div *ngFor="let message of messages; let last = last" #messageElement
          [class.animate-slideIn]="last"
          class="fade-in"
        >
          <div class="flex gap-2 md:gap-3 group">
            <img [src]="getAvatarUrl(message.username, message.avatar)" [alt]="message.username" class="w-8 md:w-10 h-8 md:h-10 rounded-full flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-1 md:gap-2 flex-wrap">
                <span class="font-semibold text-white text-sm md:text-base">{{ message.username }}</span>
                <span class="text-xs text-text-secondary">{{ formatTime(message.createdAt) }}</span>
              </div>
              <p class="text-text-primary mt-1 break-words text-sm md:text-base">{{ message.content }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="messages.length === 0" class="flex items-center justify-center h-full text-text-secondary">
          <div class="text-center">
            <p class="text-base md:text-lg font-semibold mb-2">Sin mensajes</p>
            <p class="text-xs md:text-sm">Sé el primero en escribir</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-dark-tertiary p-3 md:p-4 bg-dark-secondary flex-shrink-0">
        <form (ngSubmit)="onSendMessage()" class="flex gap-2 md:gap-3">
          <input
            type="text"
            [(ngModel)]="messageContent"
            (keyup.enter)="onSendMessage()"
            (focus)="onTypingStart()"
            (blur)="onTypingEnd()"
            (input)="onTyping()"
            name="message"
            placeholder="Mensaje..."
            class="flex-1 px-3 md:px-4 py-2 bg-dark-tertiary border border-dark-tertiary rounded-lg text-white text-sm md:text-base placeholder-text-secondary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
          />
          <button
            type="submit"
            [disabled]="!messageContent.trim() || sending"
            class="px-3 md:px-6 py-2 bg-accent text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition font-semibold text-sm md:text-base flex-shrink-0"
          >
            {{ sending ? '...' : 'Enviar' }}
          </button>
        </form>
      </div>
    </div>

    <div *ngIf="!selectedCommunity" class="flex-1 flex items-center justify-center bg-dark-primary">
      <div class="text-center text-text-secondary p-4">
        <p class="text-base md:text-lg font-semibold mb-2">Selecciona una comunidad</p>
        <p class="text-xs md:text-sm">Elige una comunidad para chatear</p>
      </div>
    </div>
  `,
  styles: [`
    .animate-slideIn {
      animation: slideUp 0.3s ease-out;
    }
  `],
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() selectedCommunity: Community | null = null;
  @Input() currentUser: User | null = null;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  messageContent = '';
  sending = false;
  userTyping$ = this.socketService.userTyping$;
  typingTimeout: any;
  private destroy$ = new Subject<void>();
  private shouldScroll = true;

  constructor(
    private socketService: SocketService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.socketService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages) => {
        this.messages = messages;
        this.shouldScroll = true;
      });

    // Detectar cambios en selectedCommunity
    // (se cargan mensajes anteriores)
  }

  ngOnChanges(): void {
    if (this.selectedCommunity) {
      this.loadPersistedMessages();
    }
  }

  private loadPersistedMessages(): void {
    if (!this.selectedCommunity) return;
    
    this.apiService.getMessages<ChatMessage>(this.selectedCommunity.id, 50).subscribe({
      next: (messages) => {
        // Invertir para mostrar más antiguos primero
        this.socketService.setMessages(messages.reverse());
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSendMessage(): void {
    if (!this.messageContent.trim() || !this.selectedCommunity || !this.currentUser) {
      return;
    }

    this.sending = true;
    this.socketService.sendMessage(
      this.messageContent,
      this.selectedCommunity.id,
      this.currentUser.id,
      this.currentUser.username,
      this.currentUser.avatar,
    );

    this.messageContent = '';
    this.sending = false;
    setTimeout(() => this.onTypingEnd(), 100);
  }

  onTypingStart(): void {
    if (this.selectedCommunity && this.currentUser) {
      this.socketService.startTyping(this.selectedCommunity.id, this.currentUser.username);
    }
  }

  onTyping(): void {
    clearTimeout(this.typingTimeout);
  }

  onTypingEnd(): void {
    if (this.selectedCommunity && this.currentUser) {
      this.typingTimeout = setTimeout(() => {
        this.socketService.stopTyping(this.selectedCommunity!.id, this.currentUser!.username);
      }, 300);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  formatTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
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
