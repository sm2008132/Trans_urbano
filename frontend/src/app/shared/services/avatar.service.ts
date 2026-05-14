export class AvatarService {
  static getInitials(username: string): string {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  static getColorFromUsername(username: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#52C4B3'
    ];
    const hash = username.charCodeAt(0) + username.charCodeAt(username.length - 1);
    return colors[hash % colors.length];
  }

  static getAvatarUrl(username: string): string {
    const initials = this.getInitials(username);
    const color = this.getColorFromUsername(username).replace('#', '');
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=40&font-size=0.4`;
  }
}
