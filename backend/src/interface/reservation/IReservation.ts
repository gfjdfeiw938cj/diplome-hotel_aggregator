import { Reservation } from 'src/schemas/Reservation.shema';
import ReservationDto from './ReservationDto';
import ReservationSearchOptions from './ReservationSearchOptions';

interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: string): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

export default IReservation;
