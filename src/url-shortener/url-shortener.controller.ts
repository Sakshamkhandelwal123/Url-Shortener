import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Redirect,
  Req,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { getErrorCodeAndMessage } from 'src/utils/helper';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { User } from 'src/users/entities/user.entity';
import { UrlNotFoundError } from 'src/utils/error';
import { AnalyticsService } from 'src/analytics/analytics.service';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(
    private readonly urlShortenerService: UrlShortenerService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post('create')
  async create(
    @CurrentUser() currentUser: User,
    @Body('createUrlShortenerDto') createUrlShortenerDto: CreateUrlShortenerDto,
  ) {
    try {
      const { url } = createUrlShortenerDto;

      const urlShortener = await this.urlShortenerService.shortenUrl(
        {
          url,
        },
        currentUser.id,
      );

      return urlShortener;
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':shortCode')
  @Redirect('', 301)
  async redirectUrl(@Param('shortCode') shortCode: string, @Req() req: any) {
    try {
      const originalUrl = await this.urlShortenerService.getLongUrl(shortCode);

      if (!originalUrl) {
        throw new UrlNotFoundError();
      }

      const referrer = req.headers.referer || '';
      const deviceType = req.headers['user-agent'] || '';
      await this.analyticsService.trackClick({
        shortCode,
        referrer,
        deviceType,
      });

      return { url: originalUrl };
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
