import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { CreateBooksDTO } from './create-books.dto';
import { BooksService } from './books.service';
import { Books } from './books.entity';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('post')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Post()
  async create(@Req() request: Request, @Body() createPostDTO: CreateBooksDTO) {
    const posts: Books = new Books();
    const userJwtPayload: JwtPayloadDto = request['user'];
    posts.title = createPostDTO.title;
    posts.author = createPostDTO.author;
    posts.category = createPostDTO.category;
    posts.image_url = createPostDTO.imageUrl;
    posts.user_id = userJwtPayload.sub;
    await this.booksService.save(posts);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Books[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.booksService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Books> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.booksService.findByUserIdAndPostId(userJwtPayload.sub, id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createPostDTO: CreateBooksDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const post: Books = await this.booksService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (post.id == null) {
      throw new NotFoundException();
    }
    post.title = createPostDTO.title;
    post.author = createPostDTO.author;
    post.category = createPostDTO.category;
    post.image_url = createPostDTO.imageUrl;
    await this.booksService.save(post);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the post' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const post: Books = await this.booksService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (post.id == null) {
      throw new NotFoundException();
    }
    await this.booksService.deleteById(id);
  }
}
