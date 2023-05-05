import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import IUserValidate from 'src/interface/user/IUserValidate';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IUserValidate | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      const validatePass = await bcrypt.compare(password, user.password);

      if (user && validatePass) {
        const result = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
          role: user.role,
        };
        return result;
      }
    } catch (e) {
      return null;
    }
  }
}
