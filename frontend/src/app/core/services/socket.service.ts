import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  communityId: string;
  createdAt: Date;
}

export interface ActiveUser {
  userId: string;
  username: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private activeUsersSubject = new BehaviorSubject<ActiveUser[]>([]);
  public activeUsers$ = this.activeUsersSubject.asObservable();

  private userTypingSubject = new BehaviorSubject<string>('');
  public userTyping$ = this.userTypingSubject.asObservable();

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor() {}

  connect(userId: string, username: string, avatar: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(environment.socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connectedSubject.next(true);
      this.socket?.emit('user-connected', {
        userId,
        username,
        avatar,
      });
    });

    this.socket.on('connection-success', (data) => {
      console.log('Connection success:', data);
    });

    this.socket.on('new-message', (message: ChatMessage) => {
      const messages = this.messagesSubject.value;
      this.messagesSubject.next([...messages, message]);
    });

    this.socket.on('message-sent', (data: { id: string }) => {
      console.log('Message sent:', data);
    });

    this.socket.on('user-typing', (data: { username: string }) => {
      this.userTypingSubject.next(data.username);
    });

    this.socket.on('user-stop-typing', () => {
      this.userTypingSubject.next('');
    });

    this.socket.on('active-users-updated', (data: { users: ActiveUser[] }) => {
      this.activeUsersSubject.next(data.users);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connectedSubject.next(false);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  joinCommunity(communityId: string): void {
    if (this.socket) {
      this.socket.emit('join-community', { communityId });
    }
  }

  leaveCommunity(communityId: string): void {
    if (this.socket) {
      this.socket.emit('leave-community', { communityId });
    }
  }

  sendMessage(
    content: string,
    communityId: string,
    userId: string,
    username: string,
    avatar: string,
  ): void {
    if (this.socket) {
      this.socket.emit('send-message', {
        content,
        communityId,
        userId,
        username,
        avatar,
      });
    }
  }

  startTyping(communityId: string, username: string): void {
    if (this.socket) {
      this.socket.emit('typing', { communityId, username });
    }
  }

  stopTyping(communityId: string, username: string): void {
    if (this.socket) {
      this.socket.emit('stop-typing', { communityId, username });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connectedSubject.next(false);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  setMessages(messages: ChatMessage[]): void {
    this.messagesSubject.next(messages);
  }
}
