import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Analytics } from './entities/analytics.entity';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics)
    private readonly analyticsModel: typeof Analytics,
  ) {}

  async trackClick(createAnalyticsDto: CreateAnalyticsDto) {
    await this.analyticsModel.create({
      timestamp: new Date(),
      ...createAnalyticsDto,
    });
  }

  async getClicksByHour(shortCode: string): Promise<any> {
    const clicksByHour = await this.analyticsModel.findAll({
      attributes: [
        [Sequelize.fn('date_part', 'year', Sequelize.col('timestamp')), 'year'],
        [Sequelize.fn('date_part', 'month', Sequelize.col('timestamp')), 'month'],
        [Sequelize.fn('date_part', 'day', Sequelize.col('timestamp')), 'day'],
        [Sequelize.fn('date_part', 'hour', Sequelize.col('timestamp')), 'hour'],
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'count'],
      ],
      where: { shortCode: shortCode },
      group: ['year', 'month', 'day', 'hour'],
      order: ['year', 'month', 'day', 'hour'],
      raw: true,
    });
  
    return clicksByHour;
  }

  async getReferralSources(shortCode: string): Promise<any> {
    const referralSources = await this.analyticsModel.findAll({
      attributes: [
        'referrer',
        [Sequelize.fn('COUNT', Sequelize.col('referrer')), 'count'],
      ],
      where: { shortCode: shortCode },
      group: ['referrer'],
    });

    return referralSources;
  }

  async getDeviceTypes(shortCode: string): Promise<any> {
    const deviceTypes = await this.analyticsModel.findAll({
      attributes: [
        'deviceType',
        [Sequelize.fn('COUNT', Sequelize.col('device_type')), 'count'],
      ],
      where: { shortCode: shortCode },
      group: ['deviceType'],
    });

    return deviceTypes;
  }
}
