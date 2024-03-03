import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @MinLength(2)
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
