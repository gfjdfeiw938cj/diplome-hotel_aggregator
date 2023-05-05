import { Message } from 'src/schemas/Message.shema';
import { SupportRequest } from 'src/schemas/SupportRequest.shema';
import GetChatListParams from './GetChatListParams';
import SendMessageDto from './SendMessageDto';

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: string): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export default ISupportRequestService;
