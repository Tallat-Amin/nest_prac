import { IsEmail, IsString, Length } from 'class-validator';
export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 22, { message: 'password has to be between 8 to 22 chars' })
  password: string;
}
