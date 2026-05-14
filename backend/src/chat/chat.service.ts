import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Message } from './schemas/message.schema';
import { CreateMessageDto, UpdateMessageDto } from './dtos/message.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  @Cron('0 */2 * * *') // Se ejecuta cada 2 horas para verificar
  async cleanOldMessages(): Promise<void> {
    try {
      // Calcular fecha de hace 12 horas
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      
      // Eliminar mensajes más antiguos de 12 horas
      const result = await this.messageModel.deleteMany({
        sentAt: { $lt: twelveHoursAgo },
      });

      if (result.deletedCount > 0) {
        console.log(`[Cleanup] Mensajes eliminados por TTL: ${result.deletedCount}`);
      }
    } catch (error) {
      console.error('[Cleanup Error]', error);
    }
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    userId: string,
    username: string,
    avatar: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      ...createMessageDto,
      userId,
      username,
      avatar,
      sentAt: new Date(),
    });

    return newMessage.save();
  }

  async getMessagesByCommunity(communityId: string, limit: number = 50): Promise<Message[]> {
    return this.messageModel
      .find({ communityId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getMessage(id: string): Promise<Message> {
    const message = await this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async updateMessage(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.getMessage(id);

    message.content = updateMessageDto.content;
    message.editedAt = new Date();
    message.updatedAt = new Date();

    return message.save();
  }

  async deleteMessage(id: string): Promise<Message> {
    const message = await this.getMessage(id);

    message.isDeleted = true;
    message.updatedAt = new Date();

    return message.save();
  }

  async searchMessages(communityId: string, searchTerm: string): Promise<Message[]> {
    return this.messageModel
      .find({
        communityId,
        isDeleted: false,
        content: { $regex: searchTerm, $options: 'i' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
