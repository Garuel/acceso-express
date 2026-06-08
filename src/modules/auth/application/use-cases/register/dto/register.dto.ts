import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { MAX_LONG_NUMERO_DOC, MIN_LONG_NUMERO_DOC } from "../../../../../../shared/domain/constants/max-min-numero-doc.constant";
import { TipoDocumentoEnum } from "../../../../../../shared/domain/enum/tipo-documento.enum";


export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(75)
  readonly username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  readonly password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly apellidoPaterno!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly apellidoMaterno!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_LONG_NUMERO_DOC)
  @MaxLength(MAX_LONG_NUMERO_DOC)
  readonly numeroDocumento!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(TipoDocumentoEnum)
  readonly idTipoDocumento!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numeroTelefono?: string;

  @IsDefined()
  @IsUUID("4")
  readonly rqUUID!: string;
}
