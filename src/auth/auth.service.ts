require('dotenv').config();
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user/user.entity';
import * as bcrypt from 'bcrypt';
import { EmailSignInDTO, EmailSignUpDTO } from './dto/auth.dto';
import { JwtPayloadEmail } from './jwt-payload.interface';

import { UserRole } from 'src/entity/user/userRole.enum';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signUpUsingEmail(emailSignUpDTO: EmailSignUpDTO) {
    try {
      const { email, password , userName , phone , address , role } = emailSignUpDTO
      let userPresent = await User.findOne({ where: { email: email } });
      if (userPresent) {
        throw new Error(
          'User is already present with this email.',
        
        );
      } else {
        let newUser = new User();
        newUser.email = email;
        newUser.userName = userName;
        newUser.address = address;
        newUser.phone = phone;
        newUser.role = UserRole[role];
        newUser.salt = await bcrypt.genSalt();
        newUser.password = await this.hashPassword(password, newUser.salt);
        await newUser.save();
        return newUser;
      }

    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
  async validatePassword(password: string, user: User): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }

  async validatePasswordAndReturnUser({ email, password }) {
    try {
      let user = await User.findOne({ where: { email: email } });
      //console.log('USER -> ', user);
      if (user) {
        if ((await this.validatePassword(password, user)) === true) {
          return user;
        } else {
          throw new Error(
            'The password you entered is incorrect. Please try again.',
          );
        }
      } else {
        throw new Error('The email you entered does not exist.');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async signInUsingEmail(emailSignInDTO: EmailSignInDTO) {
    try {
      let user = await this.validatePasswordAndReturnUser(
        emailSignInDTO,
      );
      const payload: JwtPayloadEmail = {
        email: user.email,
        password: user.password,
      };
      const accessToken = await this.jwtService.sign(payload);

      return {
        accessToken: accessToken,
        userDetails: user,
      };
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
