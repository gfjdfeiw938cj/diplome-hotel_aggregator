import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  HttpStatus,
  BadRequestException,
  UseFilters,
} from '@nestjs/common';
import { deleteCookie } from 'cookies-next';
import ICreateUserDto from 'src/interface/user/ICreateUserDto';
import { UsersService } from 'src/module/users/users.service';
import * as bcrypt from 'bcrypt';
import { HttpExceptionFilter } from 'src/HttpExceptionFilter/HttpExceptionFilter ';
import { Roles } from 'src/guards/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthenticatedGuard } from 'src/guards/authentication.guard';
import ISearchUserParams from 'src/interface/user/ISearchUserParams';
import * as mongoose from 'mongoose';

interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role: string;
}

@UseFilters(new HttpExceptionFilter())
@Controller('api')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async signin(@Request() req) {
    try {
      return { user: req.user };
    } catch (e) {
      return e;
    }
  }

  @Post('/client/register')
  async signup(@Body() CreateUserDto: ICreateUserDto) {
    const { password } = CreateUserDto;
    try {
      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT),
      );

      const user: IUser = await this.usersService.create({
        ...CreateUserDto,
        password: hashPassword,
      });
      const { _id, email, name } = user;

      return {
        id: _id.toString(),
        email: email,
        name: name,
      };
    } catch (e) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Данный еmail уже занят',
      });
    }
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/admin/users-create')
  async signupAdmin(@Body() CreateUserDto: ICreateUserDto) {
    const { password } = CreateUserDto;
    try {
      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT),
      );

      const user: IUser = await this.usersService.create({
        ...CreateUserDto,
        password: hashPassword,
      });
      const { _id, email, name, contactPhone, role } = user;

      return {
        id: _id.toString(),
        email: email,
        name: name,
        contactPhone: contactPhone,
        role: role,
      };
    } catch (e) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Данный еmail уже занят',
      });
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/auth/logout')
  async logout(@Request() req, @Response() res) {
    req.logout(function (err) {
      if (err) {
        console.log(err);
        return err;
      }
    });
    deleteCookie('connect.sid', {
      req,
      res,
    });
  }

  @Roles('admin')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/admin/users/')
  async searchAdmin(@Body() SearchUserParams: ISearchUserParams) {
    try {
      const search = await this.usersService.findAll(SearchUserParams);
      return search.map((item) => ({
        id: item._doc._id.toString(),
        email: item._doc.email,
        name: item._doc.name,
        contactPhone: item._doc.contactPhone,
      }));
    } catch (e) {
      return e;
    }
  }

  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/manager/users/')
  async searchManager(@Body() SearchUserParams: ISearchUserParams) {
    try {
      const search = await this.usersService.findAll(SearchUserParams);
      return search.map((item) => ({
        id: item._doc._id.toString(),
        email: item._doc.email,
        name: item._doc.name,
        contactPhone: item._doc.contactPhone,
      }));
    } catch (e) {
      return e;
    }
  }
}
