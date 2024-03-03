import { Module, forwardRef } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Analytics } from './entities/analytics.entity';
import { UrlShortenerModule } from 'src/url-shortener/url-shortener.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Analytics]),
    forwardRef(() => UrlShortenerModule),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
