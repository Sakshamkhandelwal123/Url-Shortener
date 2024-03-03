import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlShortenerDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
