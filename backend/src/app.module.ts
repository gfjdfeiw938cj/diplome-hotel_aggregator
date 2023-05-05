import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './module/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HotelRoomModule } from './module/hotelRoom/hotelRoom.module';
import { HotelModule } from './module/hotel/hotel.module';
import { AuthModule } from './module/auth/auth.module';
import { AuthController } from './module/auth/auth.controller';
import { AuthService } from './module/auth/auth.service';
import { ReservationModule } from './module/reservation/reservation.module';
import { SupportRequestModule } from './module/supportRequest/supportRequest.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebSoketModule } from './web-soket/webSoket.module';
import { SoketGateway } from './web-soket/webSoket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MY_CONFIG_MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MulterModule.register({
      dest: './publick/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 100,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    UsersModule,
    AuthModule,
    HotelModule,
    HotelRoomModule,
    ReservationModule,
    SupportRequestModule,
    WebSoketModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SoketGateway],
})
export class AppModule {}
