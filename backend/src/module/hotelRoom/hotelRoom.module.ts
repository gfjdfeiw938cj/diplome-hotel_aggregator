import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from 'src/schemas/HotelRoom.schema';
import { HotelModule } from '../hotel/hotel.module';
import { ReservationModule } from '../reservation/reservation.module';
import { HotelRoomController } from './hotelRoom.controller';
import { HotelRoomService } from './hotelRoom.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    HotelModule,
    ReservationModule,
  ],
  controllers: [HotelRoomController],
  providers: [HotelRoomService],
  exports: [HotelRoomService],
})
export class HotelRoomModule {}
