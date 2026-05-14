import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Community {
  id: string;
  name: string;
  description?: string;
  image?: string;
  ownerId: string;
  memberCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CommunitiesService {
  private communitiesSubject = new BehaviorSubject<Community[]>([]);
  public communities$ = this.communitiesSubject.asObservable();

  private selectedCommunitySubject = new BehaviorSubject<Community | null>(null);
  public selectedCommunity$ = this.selectedCommunitySubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.apiService.get<Community[]>('communities').subscribe(
      (communities) => {
        this.communitiesSubject.next(communities);
      },
      (error) => {
        console.error('Error loading communities:', error);
      },
    );
  }

  create(name: string, description?: string, image?: string): Observable<Community> {
    return this.apiService.post<Community>('communities', {
      name,
      description,
      image,
    });
  }

  getCommunity(id: string): Observable<Community> {
    return this.apiService.get<Community>(`communities/${id}`);
  }

  update(
    id: string,
    name?: string,
    description?: string,
    image?: string,
  ): Observable<Community> {
    return this.apiService.put<Community>(`communities/${id}`, {
      name,
      description,
      image,
    });
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete<any>(`communities/${id}`);
  }

  selectCommunity(community: Community | null): void {
    this.selectedCommunitySubject.next(community);
  }

  getSelectedCommunity(): Community | null {
    return this.selectedCommunitySubject.value;
  }

  getCommunities(): Community[] {
    return this.communitiesSubject.value;
  }
}
