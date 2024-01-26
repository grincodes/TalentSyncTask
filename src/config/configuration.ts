import { Logger } from "@nestjs/common";
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  validateSync,
} from "class-validator";

import { config } from "dotenv";
config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsBoolean()
  readonly DATABASE_LOGGING = process.env.DATABASE_LOGGING === "true";

  @IsString()
  readonly DATABASE_HOST = process.env.DATABASE_HOST as string;

  @IsInt()
  readonly DATABASE_PORT = Number(process.env.DATABASE_PORT);

  @IsString()
  readonly DATABASE_NAME = process.env.DATABASE_NAME as string;

  @IsString()
  readonly DATABASE_USER = process.env.DATABASE_USER as string;

  @IsString()
  readonly DATABASE_PASSWORD = process.env.DATABASE_PASSWORD as string;

  @IsString()
  readonly SLACK_TOKEN = process.env.SLACK_TOKEN as string;

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsInt()
  readonly JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);

  @IsBoolean()
  readonly DATABASE_SYNC = process.env.DATABASE_SYNC === "true";

  @IsString()
  readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

  @IsString()
  readonly GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

  @IsString()
  readonly GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL as string;

  @IsString()
  readonly MAIL_USERNAME = process.env.MAIL_USERNAME as string;

  @IsString()
  readonly MAIL_PASSWORD = process.env.MAIL_PASSWORD as string;

  @IsString()
  readonly FRONTEND_URL = process.env.FRONTEND_URL as string;

  @IsString()
  readonly SENDCHAMP_API_KEY = process.env.SENDCHAMP_API_KEY as string;

  @IsString()
  readonly S3_SECRET_KEY = process.env.S3_SECRET_KEY as string;

  @IsString()
  readonly S3_ACCESS_KEY = process.env.S3_ACCESS_KEY as string;

  @IsString()
  readonly S3_REGION = process.env.S3_REGION as string;

  @IsString()
  S3_BUCKET = process.env.S3_BUCKET as string;

  @IsString()
  readonly DIGITAL_OCEAN_URL = process.env.DIGITAL_OCEAN_URL as string;

  @IsString()
  readonly REDIS_URL = process.env.REDIS_URL as string;

  @IsString()
  readonly BASE_URL = process.env.BASE_URL;

  @IsInt()
  readonly PORT = Number(process.env.PORT);

  @IsString()
  readonly CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN;

  @IsNumber()
  readonly IS_PRODUCTION = Number(process.env.IS_PRODUCTION);

  @IsString()
  readonly TEST_DEV_USER_ID = process.env.TEST_DEV_USER_ID as string;

  @IsString()
  readonly TEST_PROD_USER_ID = process.env.TEST_PROD_USER_ID as string;

  constructor() {
    const error = validateSync(this);

    if (!error.length) return;
    this.logger.error(`Config validation error: ${JSON.stringify(error[0])}`);
    process.exit(1);
  }
}

export const Config = new Configuration();
