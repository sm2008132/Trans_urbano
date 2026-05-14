import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../core/services/auth.service';
import { CommunitiesService, Community } from '../../core/services/communities.service';
import { SocketService } from '../../core/services/socket.service';
import { SidebarComponent } from './sidebar.component';
import { ChatWindowComponent } from './chat-window.component';
import { CreateCommunityModalComponent } from './create-community-modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChatWindowComponent, CreateCommunityModalComponent],
  template: `
    <div class="flex h-screen bg-dark-primary text-white">
      <app-sidebar
        [communities]="communities$ | async"
        [selectedCommunity]="selectedCommunity$ | async"
        [currentUser]="currentUser$ | async"
        (selectCommunity)="onSelectCommunity($event)"
        (createCommunity)="onCreateCommunity()"
        (logout)="onLogout()"
      ></app-sidebar>

      <app-chat-window
        [selectedCommunity]="selectedCommunity$ | async"
        [currentUser]="currentUser$ | async"
      ></app-chat-window>

      <app-create-community-modal
        *ngIf="showCreateModal"
        (close)="showCreateModal = false"
        (create)="onCommunityCreated($event)"
      ></app-create-community-modal>
    </div>
  `,
  styles: [],
})
export class ChatComponent implements OnInit, OnDestroy {
  communities$ = this.communitiesService.communities$;
  selectedCommunity$ = this.communitiesService.selectedCommunity$;
  currentUser$ = this.authService.currentUser$;

  showCreateModal = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private communitiesService: CommunitiesService,
    private socketService: SocketService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.socketService.connect(user.id, user.username, user.avatar);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect();
  }

  onSelectCommunity(community: Community): void {
    this.communitiesService.selectCommunity(community);
    this.socketService.clearMessages();
    this.socketService.joinCommunity(community.id);
  }

  onCreateCommunity(): void {
    this.showCreateModal = true;
  }

  onCommunityCreated(community: Community): void {
    this.showCreateModal = false;
    this.communitiesService.loadCommunities();
    this.onSelectCommunity(community);
  }

  onLogout(): void {
    this.authService.logout();
    this.socketService.disconnect();
    this.router.navigate(['/login']);
  }
}
