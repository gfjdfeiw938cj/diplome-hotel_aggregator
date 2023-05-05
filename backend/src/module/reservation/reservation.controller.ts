import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseFilters,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { formatInTimeZone } from 'date-fns-tz';
import { AuthenticatedGuard } from 'src/guards/authentication.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';

import { HttpExceptionFilter } from 'src/HttpExceptionFilter/HttpExceptionFilter ';
import SearcReservationParams from 'src/interface/reservation/SearcReservationParams';
import { ReservationService } from './reservation.service';

@UseFilters(new HttpExceptionFilter())
@Controller('api')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Roles('client')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('client/reservations/')
  async addReservation(@Body() body) {
    const reservation = await this.reservationService.addReservation({
      ...body,
      dateStart: formatInTimeZone(
        body.dateStart,
        'Europe/Moscow',
        'yyyy-MM-dd',
      ),
      dateEnd: formatInTimeZone(body.dateEnd, 'Europe/Moscow', 'yyyy-MM-dd'),
    });

    return {
      dateStart: reservation.dateStart,
      dateEnd: reservation.dateEnd,
      hotelRoom: reservation.roomId,
      hotel: reservation.hotel,
    };
  }

  @Get('client/reservations/hotel-room/:id')
  async reservationHotelRoom(@Param() params: { id: string }) {
    const reservation = await this.reservationService
      .getReservations({
        roomId: params.id,
      })
      .then((res) =>
        res.map((item) => {
          return [item.dateStart, item.dateEnd];
        }),
      );
    return reservation;
  }

  @Roles('client')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/client/reservations/:id')
  async getReservationClient(@Param() params: { id: string }) {
    const reservation = await this.reservationService.getReservations({
      userId: params.id,
    });
    return reservation;
  }

  @Roles('client')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Delete('/client/reservations/:id')
  async removeReservation(@Param() params: { id: string }) {
    await this.reservationService.removeReservation(params.id);
  }

  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/manager/reservations/')
  async getClientsReservation(@Query() query: SearcReservationParams) {
    const reservations = await this.reservationService.getReservations({
      userId: query.userId,
      limit: query.limit,
      offset: query.offset,
    });
    return reservations;
  }

  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Delete('manager/reservations/:id')
  async removeManagerReservation(@Param() params: { id: string }) {
    await this.reservationService.removeReservation(params.id);
  }
}
