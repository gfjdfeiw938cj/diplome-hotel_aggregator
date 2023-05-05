import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/Users.schema';
import ISearchUserParams from 'src/interface/user/ISearchUserParams';
import IUserService from 'src/interface/user/IUserService';
import { create } from 'domain';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  public async create(data: Partial<User>): Promise<User> {
    const user = new this.UserModel(data);
    return await user.save();
  }

  public async findById(id: string): Promise<User> {
    const user = await this.UserModel.findById(id).select('-__v').exec();
    return user;
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email: email }).select('-__v');
    return user;
  }

  public async findAll(params: ISearchUserParams): Promise<User[]> {
    const searchQuery = await this.UserModel.find({
      $and: [
        {
          name: {
            $regex: params.name !== '' ? new RegExp(params.name) : '',
            $options: 'i',
          },
        },
        {
          email: {
            $regex: params.email !== '' ? new RegExp(params.email) : '',
            $options: 'i',
          },
        },
        {
          contactPhone: {
            $regex:
              params.contactPhone !== '' ? new RegExp(params.contactPhone) : '',
            $options: 'i',
          },
        },
      ],
    })
      .skip(params.offset)
      .limit(params.limit)
      .select('-__v -role -password');
    return searchQuery;
  }
}
