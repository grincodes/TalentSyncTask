import { Config } from "src/config";

export const UNIT_OF_WORK_PROVIDER = "unit_of_work";
export const CMS_LOGS_SLACK_CHANNEL = "cms-proj-logs";


export enum InjectionTokens {
  USER_REPO = "USER_REPO",
  BLOG_POSTS_REPO = 'BLOG_POSTS_REPO',
  QUIZ_REPO = "QUIZ_REPO",
  QUESTION_REPO = "QUESTION_REPO",
  OPTION_REPO = "OPTION_REPO",
  SESSION_REPO = "SESSION_REPO",
  PARTICIPANTS_REPO = "PARTICIPANTS_REPO",
  PARTICIPANTS_RESPONSE = "PARTICIPANTS_RESPONSE",
  ICE_BREAKER_REPO = "ICE_BREAKER_REPO",
  ICE_BREAKER_SESSION_REPO = "ICE_BREAKER_SESSION_REPO",
  ICE_BREAKER_PARTICIPANTS_REPO = "ICE_BREAKER_PARTICIPANTS_REPO",
  ICE_BREAKER_PARTICIPANTS_RESPONSE_REPO = "ICE_BREAKER_PARTICIPANTS_RESPONSE_REPO",

 
}

export enum ImageContext {
  QUIZ = "quiz",
  QUESTION = "question",
  OPTION = "option",
  ICEBREAKER = "icebreaker",
}

export const MAX_CORRECT_POINTS = 10;