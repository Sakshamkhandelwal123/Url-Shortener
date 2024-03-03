import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnalyticsDto {
  @IsString()
  @IsNotEmpty()
  shortCode: string;

  @IsString()
  @IsNotEmpty()
  referrer: string;

  @IsString()
  @IsNotEmpty()
  deviceType: string;
}
