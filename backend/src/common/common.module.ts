import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../chat/schemas/message.schema';
import { CleanupService } from './services/cleanup.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  providers: [CleanupService],
  exports: [CleanupService],
})
export class CommonModule {}
