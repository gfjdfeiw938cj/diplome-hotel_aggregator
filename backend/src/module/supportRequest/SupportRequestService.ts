import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from 'src/schemas/SupportRequest.shema';
import { Message, MessageDocument } from 'src/schemas/Message.shema';
import ISupportRequestService from 'src/interface/supportRequest/ISupportRequestService';
import SendMessageDto from 'src/interface/supportRequest/SendMessageDto';
import GetChatListParams from 'src/interface/supportRequest/GetChatListParams';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private SupportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private MessageModel: Model<MessageDocument>,
  ) {}

  public async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const findRequests = await this.SupportRequestModel.find(
      params.user
        ? {
            userId: params.user && params.user,
            isActive: params.isActive,
          }
        : { isActive: params.isActive },
    )
      .skip(params.offset)
      .limit(params.limit)
      .select('-__v ')
      .populate('userId', '_id name email contactPhone');

    return findRequests;
  }

  public async sendMessage(data: SendMessageDto): Promise<Message> {
    console.log(data);

    const message = await new this.MessageModel({
      author: data.author,
      supportRequest: data.supportRequest,
      text: data.text,
      sentAt: new Date(),
    }).save();

    await this.SupportRequestModel.findOneAndUpdate(
      {
        _id: data.supportRequest,
      },
      {
        $push: {
          messages: message,
        },
      },
      {
        new: true,
      },
    );
    return message.populate('author', '_id name');
  }

  public async getMessages(supportRequest: string): Promise<Message[]> {
    const message = await this.SupportRequestModel.findById(
      supportRequest,
    ).select('messages -_id');

    const result = message.messages.map(async (element) => {
      return await this.MessageModel.findById(element._id).populate(
        'author',
        '_id name',
      );
    });

    return Promise.all(result).then((values) => {
      return values;
    });
  }

  public subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    let a: any;
    return a;
  }
}
