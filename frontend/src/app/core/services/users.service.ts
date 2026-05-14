import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersSubject = new BehaviorSubject<UserProfile[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.get<UserProfile[]>('users/all').subscribe(
      (users) => {
        this.usersSubject.next(users);
      },
      (error) => {
        console.error('Error loading users:', error);
      },
    );
  }

  getUser(id: string): Observable<UserProfile> {
    return this.apiService.get<UserProfile>(`users/${id}`);
  }

  updateProfile(id: string, username?: string, avatar?: string, status?: string): Observable<UserProfile> {
    return this.apiService.put<UserProfile>(`users/${id}`, {
      username,
      avatar,
      status,
    });
  }

  getUsers(): UserProfile[] {
    return this.usersSubject.value;
  }
}
