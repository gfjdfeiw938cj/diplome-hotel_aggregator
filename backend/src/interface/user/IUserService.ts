import SearchUserParams from './ISearchUserParams';
import IUser from './IUser';

interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
}

export default IUserService;
