import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && user.password === password) {
      const payload = { _id: user._id };

      delete user.password;

      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    }

    if (!user) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    } else {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }
}
