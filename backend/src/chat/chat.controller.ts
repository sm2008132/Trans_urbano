import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:communityId')
  @UseGuards(JwtGuard)
  async getMessages(
    @Param('communityId') communityId: string,
    @Query('limit') limit: string = '50',
  ) {
    const messages = await this.chatService.getMessagesByCommunity(
      communityId,
      parseInt(limit),
    );

    return messages.map(msg => ({
      id: msg._id,
      userId: msg.userId,
      username: msg.username,
      avatar: msg.avatar,
      content: msg.content,
      communityId: msg.communityId,
      createdAt: msg.createdAt,
      editedAt: msg.editedAt,
      isDeleted: msg.isDeleted,
    }));
  }

  @Get('search')
  @UseGuards(JwtGuard)
  async search(
    @Query('communityId') communityId: string,
    @Query('term') term: string,
  ) {
    const messages = await this.chatService.searchMessages(communityId, term);

    return messages.map(msg => ({
      id: msg._id,
      userId: msg.userId,
      username: msg.username,
      avatar: msg.avatar,
      content: msg.content,
      communityId: msg.communityId,
      createdAt: msg.createdAt,
    }));
  }
}
