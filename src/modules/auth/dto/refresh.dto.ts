import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  readonly oldRefreshToken!: string;

  readonly ip?: string;
  readonly userAgent?: string;
}
