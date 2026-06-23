import { IsString, IsUrl } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  profile_photo!: string;
}
