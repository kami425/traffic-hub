import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min
} from 'class-validator';
import { Gender } from '../../../../utils/prisma';

export class UserInputDto {
  @Length(3, 20)
  @IsNotEmpty()
  firstName!: string;

  @Length(3, 20)
  @IsNotEmpty()
  lastName!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @Length(4, 200)
  @IsNotEmpty()
  address!: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: string;

  @IsNumber()
  @Min(18)
  @Max(100)
  @IsNotEmpty()
  age!: number;
  
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Length(6, 20)
  @IsNotEmpty()
  password!: string;
}
