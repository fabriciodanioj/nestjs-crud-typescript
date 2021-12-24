import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateArticleDto {
  @IsNotEmpty()
  title?: string;

  @IsNotEmpty()
  description?: string;

  @IsBoolean()
  active?: boolean;
}
