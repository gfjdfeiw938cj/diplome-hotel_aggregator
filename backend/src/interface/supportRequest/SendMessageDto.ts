import * as mongoose from 'mongoose';

interface SendMessageDto {
  author: string | mongoose.Types.ObjectId;
  supportRequest: string | mongoose.Types.ObjectId;
  text: string;
}

export default SendMessageDto;
