import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDTO {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email format' })
  email: string;

  @IsNotEmpty({ message: 'Verification code is required' })
  @IsString({ message: 'Verification code must be a string' })
  code: string;
}