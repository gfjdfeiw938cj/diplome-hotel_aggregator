interface IQueryHoteRoomsDto {
  limit: number;
  offset: number;
  id: string;
  startDate: Date;
  endDate: Date;
  isEnabled: boolean;
}

export default IQueryHoteRoomsDto;
