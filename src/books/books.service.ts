import { Injectable, Post } from '@nestjs/common';
import { Books } from './books.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books) private postRepository: Repository<Books>,
  ) {}

  async save(user: Books): Promise<Books> {
    return this.postRepository.save(user);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Books[]> {
    return await this.postRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndPostId(userId: number, postId: number): Promise<Books> {
    const post = await this.postRepository.findOne({
      where: {
        user_id: userId,
        id: postId,
      },
    });
    if (!post) {
      return new Books();
    }
    return post;
  }

  async deleteById(postId: number) {
    await this.postRepository.delete({ id: postId });
  }
}
