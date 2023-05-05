import { Hotel } from 'src/schemas/Hotel.schema';
import SearchHotelParams from './SearchHotelParams';
import UpdateHotelParams from './UpdateHotelParams';

interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: string): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string, data: Partial<UpdateHotelParams>): Promise<Hotel>;
}

export default IHotelService;
