import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SearchHotelParams from 'src/interface/hotel/SearchHotelParams';
import UpdateHotelParams from 'src/interface/hotel/UpdateHotelParams';
import { Hotel, HotelDocument } from 'src/schemas/Hotel.schema';
import IHotelService from 'src/interface/hotel/HotelService';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
  ) {}

  public async create(data: any): Promise<Hotel> {
    const hotel = new this.HotelModel(data);
    return await hotel.save();
  }

  public async findById(id: string): Promise<Hotel> {
    const hotel = await this.HotelModel.findById(id).select(
      '-__v -createdAt -updatedAt',
    );
    return hotel;
  }

  public async search(params: SearchHotelParams): Promise<Hotel[]> {
    const searchQuery = await this.HotelModel.find({
      title: {
        $regex: params.title !== '' ? new RegExp(params.title) : '',
        $options: 'i',
      },
    })
      .skip(params.offset)
      .limit(params.limit)
      .select('-__v -createdAt -updatedAt');

    return searchQuery;
  }

  public async update(id: string, data: UpdateHotelParams): Promise<Hotel> {
    const holelUpdate = await this.HotelModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          title: data.title,
          description: data.description,
          images:
            data.imagesSrc.length === 0 ? [] : [...data.imagesSrc.split(',')],
          updatedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    return holelUpdate;
  }
}
