import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import * as request from "supertest";
import { INestApplication } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

  let response = {
    loginResponse: {

    }
  }

  let registrationData= {
    email:"ds@gmail.com",
    password:"Grokking123$"
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

   it("Register User", () => {
     const response =  request(app.getHttpServer())
       .post("/v1/auth/register")
       .send(registrationData)
       .expect(200)
       
        expect(response).toHaveProperty("token");
   });
});
