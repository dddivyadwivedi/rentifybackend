import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/entity/user/userRole.enum';

export class EmailSignUpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address : string;

  @IsNumberString()
  @IsNotEmpty()
  phone : string;

  @IsEnum([UserRole.buyer , UserRole.seller])
  role : UserRole;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain alteast one uppercase, one lowercase, one symbol, one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  userName: string;
}

export class EmailSignInDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

