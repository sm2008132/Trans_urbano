import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { CreateMessageDto } from './dtos/message.dto';

interface UserSocket {
  userId: string;
  username: string;
  avatar: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private activeUsers: Map<string, UserSocket> = new Map();

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    for (const [socketId, user] of this.activeUsers) {
      if (socketId === client.id) {
        if (user.userId) {
          await this.usersService.setUserOffline(user.userId);
          this.activeUsers.delete(socketId);
        }
        break;
      }
    }

    this.broadcastActiveUsers();
  }

  @SubscribeMessage('user-connected')
  async handleUserConnected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string; avatar: string },
  ) {
    const { userId, username, avatar } = data;

    this.activeUsers.set(client.id, { userId, username, avatar });

    await this.usersService.setUserOnline(userId);

    this.broadcastActiveUsers();
    client.emit('connection-success', { message: 'Connected to chat server' });
  }

  @SubscribeMessage('join-community')
  async handleJoinCommunity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { communityId: string },
  ) {
    client.join(`community-${data.communityId}`);
    client.emit('joined-community', { communityId: data.communityId });
  }

  @SubscribeMessage('leave-community')
  async handleLeaveCommunity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { communityId: string },
  ) {
    client.leave(`community-${data.communityId}`);
    client.emit('left-community', { communityId: data.communityId });
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; communityId: string; userId: string; username: string; avatar: string },
  ) {
    const createMessageDto: CreateMessageDto = {
      content: data.content,
      communityId: data.communityId,
    };

    const message = await this.chatService.createMessage(
      createMessageDto,
      data.userId,
      data.username,
      data.avatar,
    );

    const messageResponse = {
      id: message._id,
      userId: message.userId,
      username: message.username,
      avatar: message.avatar,
      content: message.content,
      communityId: message.communityId,
      createdAt: message.createdAt,
    };

    // Enviar el mensaje completo al cliente que lo envió
    client.emit('new-message', messageResponse);

    // Enviar el mensaje a otros usuarios en la comunidad
    client
      .to(`community-${data.communityId}`)
      .emit('new-message', messageResponse);

    client.emit('message-sent', { id: message._id });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { communityId: string; username: string },
  ) {
    client.to(`community-${data.communityId}`).emit('user-typing', {
      username: data.username,
    });
  }

  @SubscribeMessage('stop-typing')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { communityId: string; username: string },
  ) {
    client.to(`community-${data.communityId}`).emit('user-stop-typing', {
      username: data.username,
    });
  }

  private broadcastActiveUsers() {
    const users = Array.from(this.activeUsers.values());
    const uniqueUsers = Array.from(
      new Map(users.map(u => [u.userId, u])).values(),
    );
    
    // Broadcast to all connected clients
    this.broadcastToAll('active-users-updated', {
      users: uniqueUsers,
      count: uniqueUsers.length,
    });
  }

  private broadcastToAll(event: string, data: any) {
    // This will be sent to all connected clients
    // In a real application, you might use a server-to-client emit
    const rooms = new Set<string>();
    for (const user of this.activeUsers.values()) {
      // Get all communities the users are in
    }
  }
}
