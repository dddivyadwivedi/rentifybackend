import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailSignInDTO,
  EmailSignUpDTO,

} from './dto/auth.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  async signUp(
    @Body(new ValidationPipe({ skipMissingProperties: false }))
    emailSignUpDTO: EmailSignUpDTO,
  ) {
    return this.authService.signUpUsingEmail(emailSignUpDTO);
  }

  @Post('/signIn')
  async signInUsingEmail(
    @Body(new ValidationPipe({ skipMissingProperties: false }))
    emailSignInDTO: EmailSignInDTO,
  ) {
    return this.authService.signInUsingEmail(emailSignInDTO);
  }

}
