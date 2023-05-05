interface ReservationSearchOptions {
  userId?: string;
  roomId?: string;
  dateStart?: Date;
  dateEnd?: Date;
  limit?: number;
  offset?: number;
}

export default ReservationSearchOptions;
