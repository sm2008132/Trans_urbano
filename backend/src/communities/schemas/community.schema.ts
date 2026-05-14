import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Community extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ default: null })
  image?: string;

  @Prop({ required: true })
  ownerId!: string;

  @Prop({ default: 0 })
  memberCount!: number;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
