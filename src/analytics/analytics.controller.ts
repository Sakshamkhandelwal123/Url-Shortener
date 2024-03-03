import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from 'src/auth/decorators/currentUser';
import { User } from 'src/users/entities/user.entity';
import { getErrorCodeAndMessage } from 'src/utils/helper';
import { UrlShortenerService } from 'src/url-shortener/url-shortener.service';
import {
  UrlNotAssociatedWithUserError,
  UrlNotFoundError,
} from 'src/utils/error';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly urlShortnenerService: UrlShortenerService,
  ) {}

  @Get(':shortCode/hourly')
  async getClicksByHour(
    @CurrentUser() currentUser: User,
    @Param('shortCode') shortCode: string,
  ) {
    try {
      const link = await this.urlShortnenerService.findOne({ shortCode });

      if (!link) {
        throw new UrlNotFoundError();
      }

      if (link && link.createdBy !== currentUser.id) {
        throw new UrlNotAssociatedWithUserError();
      }

      return this.analyticsService.getClicksByHour(shortCode);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':shortCode/referral-sources')
  async getReferralSources(
    @CurrentUser() currentUser: User,
    @Param('shortCode') shortCode: string,
  ) {
    try {
      const link = await this.urlShortnenerService.findOne({ shortCode });

      if (!link) {
        throw new UrlNotFoundError();
      }

      if (link && link.createdBy !== currentUser.id) {
        throw new UrlNotAssociatedWithUserError();
      }

      return this.analyticsService.getReferralSources(shortCode);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':shortCode/device-types')
  async getDeviceTypes(
    @CurrentUser() currentUser: User,
    @Param('shortCode') shortCode: string,
  ): Promise<any> {
    try {
      const link = await this.urlShortnenerService.findOne({ shortCode });

      if (!link) {
        throw new UrlNotFoundError();
      }

      if (link && link.createdBy !== currentUser.id) {
        throw new UrlNotAssociatedWithUserError();
      }

      return this.analyticsService.getDeviceTypes(shortCode);
    } catch (error) {
      throw new HttpException(
        getErrorCodeAndMessage(error),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
