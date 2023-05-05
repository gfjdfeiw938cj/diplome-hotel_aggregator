import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import IHotelRoomService from 'src/interface/hotel/HotelRoomService';
import SearchRoomsParams from 'src/interface/hotel/SearchRoomsParams';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/HotelRoom.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  public async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const hotelRoom = new this.HotelRoomModel(data);
    await hotelRoom.save();
    return hotelRoom.populate([
      {
        path: 'hotel',
        transform: function (value) {
          return {
            id: value._id,
            title: value.title,
            description: value.description,
          };
        },
      },
    ]);
  }

  public async findById(id: string): Promise<HotelRoom> {
    const hotelRoom = await this.HotelRoomModel.findById(id)
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'hotel',
        transform: function (value) {
          return {
            id: value._id,
            title: value.title,
            description: value.description,
          };
        },
      });
    return hotelRoom;
  }

  public async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    let searchQuery;
    if (typeof params.hotel === 'object') {
      searchQuery = await this.HotelRoomModel.find({
        hotel: params.hotel,
      })
        .skip(params.isEnabled === true ? 0 : params.offset)
        .limit(params.isEnabled === true ? 0 : params.limit)
        .select('-__v -createdAt -updatedAt -isEnabled')
        .populate({
          path: 'hotel',
          transform: function (value) {
            return {
              id: value._id,
              title: value.title,
            };
          },
        });
    } else {
      searchQuery = await this.HotelRoomModel.find()
        .skip(params.isEnabled === true ? 0 : params.offset)
        .limit(params.isEnabled === true ? 0 : params.limit)
        .select('-__v -createdAt -updatedAt -isEnabled')
        .populate({
          path: 'hotel',
          transform: function (value) {
            return {
              id: value._id,
              title: value.title,
            };
          },
        });
    }

    return searchQuery;
  }

  public async update(
    id: string,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoom> {
    const holelRoomUpdate = await this.HotelRoomModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          description: data.description,
          images: data.images,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
      },
    );
    return holelRoomUpdate;
  }
}
