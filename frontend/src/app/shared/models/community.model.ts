export interface Community {
  id: string;
  name: string;
  description?: string;
  image?: string;
  ownerId: string;
  memberCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCommunityPayload {
  name: string;
  description?: string;
  image?: string;
}
