import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  avatar!: string;

  @Prop({ required: true })
  communityId!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: null })
  editedAt?: Date;

  @Prop({ default: false })
  isDeleted!: boolean;

  @Type(() => Date)
  @Prop({ default: Date.now })
  createdAt?: Date;

  @Type(() => Date)
  @Prop({ default: Date.now })
  updatedAt?: Date;

  @Type(() => Date)
  @Prop({ default: Date.now, index: { expires: '12h' } })
  sentAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
// Configurar índice TTL para eliminar mensajes después de 12 horas (43200 segundos)
MessageSchema.index({ sentAt: 1 }, { expireAfterSeconds: 43200 });
