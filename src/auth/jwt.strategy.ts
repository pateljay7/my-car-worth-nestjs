import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService, // Inject ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Use ConfigService
    });
  }

  async validate(payload: any) {
    const currentUser = await this.usersService.findOne(payload.userId);
    if (!currentUser) {
      throw new UnauthorizedException();
    }
    return currentUser;
  }

  generateToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }
}
