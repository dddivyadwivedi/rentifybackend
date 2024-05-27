import { PartialType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  noOfBedrooms: number;

  @IsNotEmpty()
  @IsNumber()
  noOfBathrooms: number;

  @IsNotEmpty()
  @IsNumber()
  noOfHospitalsNearBy: number;

  @IsNotEmpty()
  @IsString()
  price: string;
}

export class EditPropertyDTO extends PartialType(CreatePropertyDTO) {}



export class GetPropertyDTO {
  @IsOptional()
  @IsNumberString()
  skip: string;

  @IsOptional()
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsNumberString()
  location: string;

  @IsOptional()
  @IsNumberString()
  priceMin : string;

  @IsOptional()
  @IsNumberString()
  priceMax: string;

  @IsOptional()
  @IsNumberString()
  bedrooms: string;

  @IsOptional()
  @IsNumberString()
  bathrooms: string;
}

export class LikePropertyDto {
    @IsNotEmpty()
    @IsNumber()
    propertyId: string;

    @IsNotEmpty()
    @IsNumber()
    buyerId: string;
}

export class InterestedEmailDTO{
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;

    @IsNotEmpty()
    @IsNumber()
    buyerId: number;

    @IsNotEmpty()
    @IsNumber()
    sellerId : number;
}

