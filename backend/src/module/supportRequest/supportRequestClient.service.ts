import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import ISupportRequestClientService from 'src/interface/supportRequest/ISupportRequestClientService';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/SupportRequest.shema';
import CreateSupportRequestDto from 'src/interface/supportRequest/Dto/CreateSupportRequestDto';
import MarkMessagesAsReadDto from 'src/interface/supportRequest/MarkMessagesAsReadDto';
import { Message, MessageDocument } from 'src/schemas/Message.shema';
import { SupportRequestService } from './SupportRequestService';

@Injectable()
export class SupportRequestClient implements ISupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
    private readonly supportRequestService: SupportRequestService,
  ) {}

  public async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const createsupportRequest = await new this.SupportRequestModel({
      userId: data.user,
      createdAt: new Date(),
      messages: [],
      theme: data.theme,
      isActive: true,
    }).save();

    const message = await this.supportRequestService.sendMessage({
      author: data.user,
      supportRequest: createsupportRequest._id,
      text: data.text,
    });

    await this.SupportRequestModel.findOneAndUpdate(
      { _id: createsupportRequest._id },
      {
        $set: {
          messages: [message],
        },
      },
      {
        new: true,
      },
    );

    return createsupportRequest;
  }

  public async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const supprtRequst = await this.SupportRequestModel.findById(
      params.supportRequest,
    );

    const resultMessage = supprtRequst.messages.map(async (element) => {
      if (element.author.toString() !== supprtRequst.userId.toString()) {
        return await this.MessageModel.findOneAndUpdate(element._id, {
          $set: {
            readAt: params.createdBefore,
          },
        });
      }
    });
    Promise.all(resultMessage);

    const resultSupport = supprtRequst.messages.map((element) => {
      if (element.author.toString() !== supprtRequst.userId.toString()) {
        return { ...element, readAt: params.createdBefore };
      }
      return element;
    });

    await this.SupportRequestModel.findOneAndUpdate(
      { _id: params.supportRequest },
      {
        $set: {
          messages: resultSupport,
        },
      },
    );
  }

  public async getUnreadCount(supportRequest: string): Promise<Message[]> {
    const message = [];
    new this.MessageModel(supportRequest);
    return message;
  }
}
