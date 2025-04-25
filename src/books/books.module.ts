import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Books } from './books.entity';

@Module({
  providers: [BooksService],
  imports: [TypeOrmModule.forFeature([ Books ])],
  controllers: [BooksController]
})
export class BooksModule {}
