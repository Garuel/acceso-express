import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PreRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(75)
  readonly username!: string;

  readonly ip?: string;
  readonly userAgent?: string;
}
