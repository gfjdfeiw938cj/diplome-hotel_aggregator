import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseFilters,
  Query,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/HttpExceptionFilter/HttpExceptionFilter ';
import { AuthenticatedGuard } from 'src/guards/authentication.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  destinationhotelRoom,
  editFileName,
} from 'src/utils/file-upload.utils';
import { HotelRoomService } from './hotelRoom.service';
import ICreateHoteRoomlDto from 'src/interface/hotel/Dto/ICreateHoteRoomlDto';
import * as mongoose from 'mongoose';
import IQueryHoteRoomAdminDto from 'src/interface/hotel/Dto/IQueryHoteRoomAdminDto';
import { HotelService } from '../hotel/hotel.service';
import IQueryHoteRoomsDto from 'src/interface/hotel/Dto/IQueryHoteRoomsDto';
import { ReservationService } from '../reservation/reservation.service';

@UseFilters(new HttpExceptionFilter())
@Controller('api')
export class HotelRoomController {
  constructor(
    private readonly hotelRoomService: HotelRoomService,
    private readonly hotelService: HotelService,
    private readonly reservationService: ReservationService,
  ) {}

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/admin/hotel-rooms')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destinationhotelRoom,
        filename: editFileName,
      }),
    }),
  )
  async addHotelRoom(
    @Body() body: ICreateHoteRoomlDto,
    @UploadedFiles() files,
  ) {
    const hotelId = await this.hotelService.findById(body.id);
    const data = {
      hotel: hotelId._id,
      description: body.description,
      images: files.map((file) => file.originalname),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const hotelRoom = await this.hotelRoomService.create(data);

    return {
      id: hotelRoom._id.toString(),
      description: hotelRoom.description,
      images: hotelRoom.images,
      isEnabled: hotelRoom.isEnabled,
      hotel: hotelRoom.hotel,
    };
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('admin/hotel-rooms/')
  async searchAdminRooms(@Query() query: IQueryHoteRoomAdminDto) {
    const id =
      query.id.length === 24 ? new mongoose.Types.ObjectId(query.id) : '';

    const search = await this.hotelRoomService.search({ ...query, hotel: id });
    const result = search.map((item) => ({
      id: item._id.toString(),
      description: item.description,
    }));

    return result;
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/admin/hotels-room/:id')
  async getHotelRoomAdmin(@Param() params: { id: string }) {
    const hotelRoom = await this.hotelRoomService.findById(params.id);
    return hotelRoom;
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Put('/admin/hotels-room/:id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destinationhotelRoom,
        filename: editFileName,
      }),
    }),
  )
  async UpdateHotelRoom(@Param() params: { id: string }, @Body() body) {
    const data = {
      description: body.description,
      images: body.images.length === 0 ? [] : [...body.images.split(',')],
    };
    await this.hotelRoomService.update(params.id, data);
  }

  @Get('/common/hotel-rooms')
  async searchHotelRooms(@Query() query: IQueryHoteRoomsDto) {
    let reservations;
    const data = {
      hotel:
        query.id.length === 24 ? new mongoose.Types.ObjectId(query.id) : '',
      limit: query.limit,
      offset: query.offset,
      isEnabled: query.isEnabled,
    };

    const search = await this.hotelRoomService.search(data);
    const result = search.map((item) => ({
      id: item._id,
      description: item.description,
      hotel: item.hotel,
      images: item.images,
    }));

    if (query.startDate && query.endDate) {
      reservations = await this.reservationService.getReservations({
        dateStart: query.startDate,
        dateEnd: query.endDate,
      });

      return result.filter(
        (el) =>
          reservations.some(
            (item) => item.roomId.id.toString() === el.id.toString(),
          ) !== true,
      );
    }
    return result;
  }

  @Get('/common/hotel-rooms/:id')
  async getHotelRoom(@Param() params: { id: string }) {
    const hotelRoom = await this.hotelRoomService.findById(params.id);
    return hotelRoom;
  }
}
