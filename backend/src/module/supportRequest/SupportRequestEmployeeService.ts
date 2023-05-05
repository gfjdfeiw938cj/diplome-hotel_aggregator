import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ISupportRequestEmployeeService from 'src/interface/supportRequest/ISupportRequestEmployeeService';
import MarkMessagesAsReadDto from 'src/interface/supportRequest/MarkMessagesAsReadDto';
import { Message, MessageDocument } from 'src/schemas/Message.shema';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/SupportRequest.shema';
import { SupportRequestService } from './SupportRequestService';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
    private readonly supportRequestService: SupportRequestService,
  ) {}

  public async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const supprtRequst = await this.SupportRequestModel.findById(
      params.supportRequest,
    );

    const resultMessage = supprtRequst.messages.map(async (element) => {
      if (element.author.toString() === supprtRequst.userId.toString()) {
        return await this.MessageModel.findOneAndUpdate(element._id, {
          $set: {
            readAt: params.createdBefore,
          },
        });
      }
    });
    Promise.all(resultMessage);

    const resultSupport = supprtRequst.messages.map((element) => {
      if (element.author.toString() === supprtRequst.userId.toString()) {
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
    return await this.MessageModel.find({ author: supportRequest });
  }

  public async closeRequest(supportRequest: string): Promise<void> {
    await this.SupportRequestModel.findOneAndUpdate(
      { _id: supportRequest },
      {
        $set: {
          isActive: false,
        },
      },
    );
  }
}

export default SupportRequestEmployeeService;
