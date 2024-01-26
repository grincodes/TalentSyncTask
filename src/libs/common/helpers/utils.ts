import {
  HttpStatus,
  HttpException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import axios from "axios";
import { Config } from "src/config";
import { CMS_LOGS_SLACK_CHANNEL } from "src/libs/constants";
import { randomBytes } from "crypto";

import * as crypto from "crypto";

interface FileValidationProps {
  supportedFormats: string[];
  maxFileSize: number;
  file;
}

const handleDbErrors = (err) => {
  //foreign key voiation error
  if (err.number === 547) {
    // Handle foreign key violation error here
    throw new BadRequestException("Invalid Foreign Key");
  }
  //duplicate value
  else if (err.number === 2627 || err.number === 2601) {
    throw new BadRequestException("DB duplicate error value already exists");
  }
};

export const handleErrorCatch = (err, source?: string) => {
  handleDbErrors(err);

  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED ||
    err.status === HttpStatus.FORBIDDEN ||
    err.status === HttpStatus.CONFLICT
  ) {
    throw new HttpException(
      {
        status: err.status,
        error: err.response.message || err.response.error,
      },
      err.status
    );
  }

  if (source) {
    sendLogMessageToSlack(
      CMS_LOGS_SLACK_CHANNEL,
      JSON.stringify({
        source: source,
        err: {
          message: err.message,
          stack: err.stack,
        },
      })
    );
  }

  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured with the message: ${err.message}`,
    },
    HttpStatus.INTERNAL_SERVER_ERROR
  );
};

export const sendLogMessageToSlack = (channel: string, messsage: string) => {
  try {
    const slackUrl = "https://slack.com/api/chat.postMessage";
    axios.post(
      slackUrl,
      {
        channel,
        text: messsage,
      },
      { headers: { authorization: `Bearer ${Config.SLACK_TOKEN}` } }
    );
  } catch (err) {
    Logger.log(`Error sending slack message: ${err.message}`);
  }
};

export const validateFile = (fileValidationProps: FileValidationProps) => {
  if (!fileValidationProps.file) {
    throw new BadRequestException("no file detected");
  }

  const checkFormat = fileValidationProps.supportedFormats.find(
    (format) => format == fileValidationProps.file.mimetype
  );

  if (!checkFormat) {
    throw new BadRequestException("file format not supported");
  }

  //900kb 900 000
  if (fileValidationProps.file.size > fileValidationProps.maxFileSize) {
    throw new BadRequestException("file too large");
  }
};

export const convertFileToBufferFromUrl = async (
  fileUrl: string
): Promise<Buffer> => {
  const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
};

export const convertFileToStreamFromUrl = async (
  fileUrl: string
): Promise<{ headers; data }> => {
  const response = await axios.get(fileUrl, { responseType: "stream" });
  return {
    headers: response.headers,
    data: response.data,
  };
};

export function generateVerificationToken(): string {
  // Generate a random 16-byte buffer using crypto
  const _randomBytes = randomBytes(16);

  // Convert the buffer to a hexadecimal string
  const token = _randomBytes.toString("hex");

  return token;
}
export function generateAccountVerficationEmailMessage(
  email: string,
  verificationToken: string
) {
  // const verificationLink = `${ process.env.URL }/v1/user/verify?token=${ token }`;
  const verificationLink = `${Config.FRONTEND_URL}/email-verify?email=${email}&token=${verificationToken}`;
  return {
    subject: "Account Verification",
    html: `
    <p>Thank you for creating an account with us!</p>
    <p>Please click the following link to verify your account:</p>
    <a href="${verificationLink}">Verify Account</a>
    <p>If you didn't create an account, you can ignore this email.</p>
  `,
  };
}
export function generateForgotPasswordEmailMessage(token: string) {
  const resetUrl = `${Config.FRONTEND_URL}/reset-password?token=${token}`;

  return {
    from: "no-reply@jasere.com",
    subject: "Forgot Password",
    html: `<h3>Forgot Password</h3>
    <p>You have requested to reset your password. Please click the link below to reset it: ${token}</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p> `,
  };
}

export function hashStringToUUID(inputString: string) {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  const hashedString = hash.digest("hex");

  // Formatted as a valid UUID with 8-4-4-4-12 pattern
  const uuid = `${hashedString.substr(0, 8)}-${hashedString.substr(
    8,
    4
  )}-${hashedString.substr(12, 4)}-${hashedString.substr(
    16,
    4
  )}-${hashedString.substr(20, 12)}`;

  return uuid;
}
