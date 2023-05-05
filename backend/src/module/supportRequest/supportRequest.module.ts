import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/Message.shema';
import {
  SupportRequest,
  SupportRequestSchema,
} from 'src/schemas/SupportRequest.shema';
import { ReservationController } from './supportRequest.controller';
import { SupportRequestClient } from './supportRequestClient.service';
import SupportRequestEmployeeService from './SupportRequestEmployeeService';
import { SupportRequestService } from './SupportRequestService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [
    SupportRequestClient,
    SupportRequestService,
    SupportRequestEmployeeService,
  ],
})
export class SupportRequestModule {}
