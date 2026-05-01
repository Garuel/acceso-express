import { Transform } from "class-transformer";
import { IsDefined, IsInt, IsOptional, Min } from "class-validator";

export class UploadProfilePictureDto {
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsInt()
  @IsDefined()
  @Min(1)
  idUsuario!: number;

  @IsOptional() //TODO: VALIDAR BIEN
  file!: Express.Multer.File;
}
