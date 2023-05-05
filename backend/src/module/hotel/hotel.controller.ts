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
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/guards/authentication.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { HttpExceptionFilter } from 'src/HttpExceptionFilter/HttpExceptionFilter ';
import { HotelService } from './hotel.service';
import SearchHotelParams from 'src/interface/hotel/SearchHotelParams';
import ICreateHotelDto from './Dto/ICreateHotelDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { destination, editFileName } from 'src/utils/file-upload.utils';

@UseFilters(new HttpExceptionFilter())
@Controller('api')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/admin/hotels')
  async addHotel(@Body() CreateHotelDto: ICreateHotelDto) {
    const hotel = await this.hotelService.create(CreateHotelDto);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/admin/hotels/')
  async searchAdmin(@Query() query: SearchHotelParams) {
    const search = await this.hotelService.search(query);
    const result = search.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
    }));
    return result;
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/admin/hotels/:id')
  async getHotelAdmin(@Param() params: { id: string }) {
    const hotel = await this.hotelService.findById(params.id);
    return hotel;
  }

  @Get('/common/hotel/:id')
  async getHotel(@Param() params: { id: string }) {
    const hotel = await this.hotelService.findById(params.id);
    return hotel;
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Put('/admin/hotels/:id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: destination,
        filename: editFileName,
      }),
    }),
  )
  async putUpdateHotel(@Param() params: { id: string }, @Body() body) {
    await this.hotelService.update(params.id.slice(1), body);
  }
}
