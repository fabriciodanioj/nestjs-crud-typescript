import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './articles.schema';
import { InjectModel } from '@nestjs/mongoose';

interface IUserQuery {
  active: boolean;
}

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articlesModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = await this.articlesModel.create(createArticleDto);
    return article;
  }

  async findAll() {
    const pipeline = [];

    const $match: IUserQuery = {
      active: true,
    };

    pipeline.push({
      $match,
    });

    const articles = await this.articlesModel.aggregate(pipeline);

    const total = await this.articlesModel.countDocuments();

    return {
      articles,
      pagination: {
        total,
      },
    };
  }

  async findOne(id: string) {
    const article = await this.articlesModel.findById(id);

    if (!article) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    let article = await this.articlesModel.findById(id);

    if (!article) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    article = await this.articlesModel.findByIdAndUpdate(id, updateArticleDto, {
      new: true,
    });

    return article;
  }

  async remove(id: string) {
    const article = await this.articlesModel.findById(id);

    if (!article) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    await this.articlesModel.findByIdAndDelete(id);

    return;
  }
}
