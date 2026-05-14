import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Message } from '../../chat/schemas/message.schema';

@Injectable()
export class CleanupService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  @Cron('0 0 * * *') // Se ejecuta cada día a las 00:00
  async cleanOldMessages(): Promise<void> {
    try {
      // Calcular fecha de hace 24 horas
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Eliminar mensajes más antiguos de 24 horas
      const result = await this.messageModel.deleteMany({
        createdAt: { $lt: oneDayAgo },
      });

      console.log(`[Cleanup] Mensajes eliminados: ${result.deletedCount}`);
    } catch (error) {
      console.error('[Cleanup Error]', error);
    }
  }

  // Método para limpiar manualmente si es necesario
  async cleanMessagesManually(hoursOld: number = 24): Promise<number> {
    const cutoffDate = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    const result = await this.messageModel.deleteMany({
      createdAt: { $lt: cutoffDate },
    });
    return result.deletedCount;
  }
}
