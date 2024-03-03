import { Injectable } from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import * as shortid from 'shortid';
import { InjectModel } from '@nestjs/sequelize';
import { Link } from './entities/link.entity';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectModel(Link)
    private readonly linkModel: typeof Link,
  ) {}

  async shortenUrl(
    createUrlShortenerDto: CreateUrlShortenerDto,
    userId: string,
  ) {
    const { url } = createUrlShortenerDto;

    const shortCode = shortid.generate();

    return this.linkModel.create({
      shortCode,
      originalUrl: url,
      createdBy: userId,
    });
  }

  async getLongUrl(shortCode: string) {
    const record = await this.linkModel.findOne({
      where: { shortCode },
    });

    if (record) {
      return record.originalUrl;
    }

    return null;
  }

  findOne(condition = {}, options = {}) {
    return this.linkModel.findOne({
      where: condition,
      ...options,
    });
  }
}
