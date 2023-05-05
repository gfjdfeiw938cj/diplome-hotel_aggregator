import { Message } from 'src/schemas/Message.shema';
import { SupportRequest } from 'src/schemas/SupportRequest.shema';
import CreateSupportRequestDto from './Dto/CreateSupportRequestDto';
import MarkMessagesAsReadDto from './MarkMessagesAsReadDto';

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(
    supportRequest: string,
    userIdRequest: string,
  ): Promise<Message[]>;
}

export default ISupportRequestClientService;
