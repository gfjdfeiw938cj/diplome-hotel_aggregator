import * as mongoose from 'mongoose';

interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: mongoose.Types.ObjectId | string;
  isEnabled?: boolean;
}

export default SearchRoomsParams;
