import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Link } from './entities/link.entity';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [SequelizeModule.forFeature([Link]), AnalyticsModule],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
  exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
