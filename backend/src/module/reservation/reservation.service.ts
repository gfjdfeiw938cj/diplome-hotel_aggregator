import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/schemas/Reservation.shema';
import ReservationDto from 'src/interface/reservation/ReservationDto';
import ReservationSearchOptions from 'src/interface/reservation/ReservationSearchOptions';
import IReservation from 'src/interface/reservation/IReservation';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>,
  ) {}

  public async addReservation(data: ReservationDto): Promise<Reservation> {
    const checkReservationDays = await this.getReservations({
      roomId: data.roomId,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });

    if (checkReservationDays.length === 0) {
      const reservation = await this.ReservationModel.create(data);
      await reservation.populate([
        {
          path: 'roomId',
          transform: function (value) {
            return {
              description: value.description,
              images: value.images,
            };
          },
        },
        {
          path: 'hotel',
          transform: function (value) {
            return {
              title: value.title,
              description: value.description,
              images: value.images,
            };
          },
        },
      ]);

      return reservation;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'BAD_REQUEST',
          message: 'На данный период есть забронированые дни',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async removeReservation(id: string): Promise<void> {
    await this.ReservationModel.findByIdAndRemove(id);
  }

  public async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    let reservation;

    if (filter.roomId && filter.dateStart && filter.dateEnd) {
      reservation = await this.ReservationModel.find({
        roomId: filter.roomId,
        $and: [
          {
            $or: [
              {
                dateStart: { $gte: filter.dateStart, $lte: filter.dateEnd },
              },
              {
                dateEnd: { $gte: filter.dateStart, $lte: filter.dateEnd },
              },
            ],
          },
        ],
      });
    }

    if (filter.roomId && !filter.dateStart && !filter.dateEnd) {
      reservation = await this.ReservationModel.find({
        roomId: filter.roomId,
      });
    }

    if (filter.userId && filter.dateStart && filter.dateEnd) {
      reservation = await this.ReservationModel.find({
        userId: filter.userId,
        $and: [
          {
            $or: [
              {
                dateStart: { $gte: filter.dateStart, $lte: filter.dateEnd },
              },
              {
                dateEnd: { $gte: filter.dateStart, $lte: filter.dateEnd },
              },
            ],
          },
        ],
      });
    }

    if (filter.userId && !filter.dateStart && !filter.dateEnd) {
      reservation = await this.ReservationModel.find({
        userId: filter.userId,
      }).populate([
        {
          path: 'roomId',
          transform: function (value) {
            return {
              description: value.description,
              images: value.images,
            };
          },
        },
        {
          path: 'hotel',
          transform: function (value) {
            return {
              title: value.title,
              description: value.description,
              images: value.images,
            };
          },
        },
      ]);
    }

    if (
      !filter.userId &&
      !filter.roomId &&
      !filter.dateStart &&
      !filter.dateEnd
    ) {
      reservation = await this.ReservationModel.find({})
        .skip(filter.offset)
        .limit(filter.limit)
        .select('-__v')
        .populate([
          {
            path: 'roomId',
            transform: function (value) {
              return {
                description: value.description,
                images: value.images,
              };
            },
          },
          {
            path: 'hotel',
            transform: function (value) {
              return {
                title: value.title,
                description: value.description,
                images: value.images,
              };
            },
          },
        ]);
    }

    if (
      !filter.userId &&
      !filter.roomId &&
      filter.dateStart &&
      filter.dateEnd
    ) {
      reservation = await this.ReservationModel.find({
        $or: [
          {
            dateStart: { $gte: filter.dateStart, $lte: filter.dateEnd },
          },
          {
            dateEnd: { $gte: filter.dateStart, $lte: filter.dateEnd },
          },
        ],
      })
        .select('-__v')
        .populate([
          {
            path: 'roomId',
            transform: function (value) {
              return {
                id: value._id,
              };
            },
          },
        ]);
    }
    return reservation;
  }
}
