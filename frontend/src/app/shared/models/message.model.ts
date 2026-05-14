export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  communityId: string;
  createdAt: Date;
}

export interface CreateMessagePayload {
  content: string;
  communityId: string;
}
