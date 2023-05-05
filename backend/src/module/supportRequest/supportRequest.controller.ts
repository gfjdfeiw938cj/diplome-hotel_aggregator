import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthenticatedGuard } from 'src/guards/authentication.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { HttpExceptionFilter } from 'src/HttpExceptionFilter/HttpExceptionFilter ';
import CreateSupportRequestDto from 'src/interface/supportRequest/Dto/CreateSupportRequestDto';
import GetSupportRequestDto from 'src/interface/supportRequest/Dto/GetSupportRequestDto';
import { SupportRequestClient } from './supportRequestClient.service';
import SupportRequestEmployeeService from './SupportRequestEmployeeService';
import { SupportRequestService } from './SupportRequestService';

@UseFilters(new HttpExceptionFilter())
@Controller('api')
export class ReservationController {
  constructor(
    private readonly supportRequestClient: SupportRequestClient,
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Roles('client')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/client/support-requests/')
  async createSupportRequest(@Body() body: CreateSupportRequestDto) {
    const supportRequest = await this.supportRequestClient.createSupportRequest(
      body,
    );
    this.eventEmitter.emit('support.created', 'Новое обращение');

    return {
      id: supportRequest.userId.toString(),
      createdAt: supportRequest.userId,
      isActive: supportRequest.isActive,
      hasNewMessages: true,
    };
  }

  @Roles('client')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/client/support-requests/')
  async getSupportRequestClient(
    @Req() req,
    @Query() query: GetSupportRequestDto,
  ) {
    const supportRequest = await this.supportRequestService.findSupportRequests(
      {
        ...query,
        user: req.user?.id || null,
      },
    );

    supportRequest.map((item) => {
      console.log(item);
    });

    return supportRequest.map((item) => {
      return {
        id: item._id,
        createdAt: item.createdAt,
        isActive: item.isActive,
        theme: item.theme,
        hasNewMessages: item.messages.some(
          (item) => item.author?.toString() !== req.user?.id && !item.readAt,
        ),
      };
    });
  }

  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/manager/support-requests/')
  async getManagerSupportRequestClient(
    @Req() req,
    @Query() query: GetSupportRequestDto,
  ) {
    const supportRequest = await this.supportRequestService.findSupportRequests(
      {
        ...query,
      },
    );

    const result: any = supportRequest;

    return result.map((item) => {
      return {
        id: item._id,
        createdAt: item.createdAt,
        isActive: item.isActive,
        theme: item.theme,
        hasNewMessages: item.messages.some(
          (item) => item.author.toString() !== req.user?.id && !item.readAt,
        ),
        client: {
          id: item.userId._id,
          email: item.userId.email,
          name: item.userId.name,
          contactPhone: item.userId.contactPhone,
        },
      };
    });
  }

  @Roles('client', 'manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Get('/common/support-requests/:id/messages')
  async getHistoryMessageSupportReques(
    @Req() req,
    @Param() params: { id: string },
  ) {
    const messages = await this.supportRequestService.getMessages(params.id);

    const validateUser = messages.some(
      (item) => item.author._id.toString() === req.user?.id,
    );

    if (req.user && req.user.role === 'client' && validateUser) {
      return messages;
    } else if (req.user && req.user.role === 'client' && !validateUser) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Данный пользоветель не создавал обращение',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return messages;
  }

  @Roles('client', 'manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/common/support-requests/:id/messages')
  async sendMessage(
    @Body() body: { text: string },
    @Req() req,
    @Param() params: { id: string },
  ) {
    const messages = await this.supportRequestService.sendMessage({
      author: req.user?.id,
      supportRequest: params.id,
      text: body.text,
    });

    this.eventEmitter.emit(`sendMessage.${params.id}`, messages);
  }

  @Roles('client', 'manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/common/support-requests/:id/messages/read')
  async readMessage(
    @Body() body: { createdBefore: Date },
    @Req() req,
    @Param() params: { id: string },
  ) {
    if (req.user?.role === 'client') {
      await this.supportRequestClient.markMessagesAsRead({
        user: req.user.id,
        supportRequest: params.id,
        createdBefore: body.createdBefore,
      });
    }

    if (req.user?.role === 'manager') {
      await this.supportRequestEmployeeService.markMessagesAsRead({
        user: req.user.id,
        supportRequest: params.id,
        createdBefore: body.createdBefore,
      });
    }
  }
  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  @Post('/common/support-requests/close/:id')
  async closeRequest(@Param() params: { id: string }) {
    await this.supportRequestEmployeeService.closeRequest(params.id);
  }
}
