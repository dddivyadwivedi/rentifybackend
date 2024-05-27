require('dotenv').config();
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/entity/user/user.entity';
import { JwtPayloadEmail } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: JwtPayloadEmail) {
    //console.log('JWT payload -> ', payload);
    const { email } = payload;
    let user = await User.findOne({ where: { email: email } });
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
