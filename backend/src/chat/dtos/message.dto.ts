import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  content!: string;

  @IsUUID()
  communityId!: string;
}

export class UpdateMessageDto {
  @IsString()
  @MinLength(1)
  content!: string;
}
