import { Message } from 'src/schemas/Message.shema';
import { ID } from '../ID';
import MarkMessagesAsReadDto from './MarkMessagesAsReadDto';

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: string): Promise<Message[]>;
  closeRequest(supportRequest: string): Promise<void>;
}

export default ISupportRequestEmployeeService;
