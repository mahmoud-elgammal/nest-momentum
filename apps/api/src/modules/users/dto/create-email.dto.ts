import { IsEmail } from 'class-validator';

export class CreateEmailDTO {
    @IsEmail()
    email: string;
}