import { IsInt, IsIn } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @IsIn([1, 2, 3, 4, 5]) // Validate that the rating is between 1 and 5
  rating: number;
}
