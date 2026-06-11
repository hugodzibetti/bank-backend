import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users/find (GET)', () => {
    it('should return 401 Unauthorized when no credentials are provided', () => {
      return request(app.getHttpServer()).get('/user/find?id=1').expect(401);
    });

    it('should return 200 and the users when valid credentials and ID are provided', () => {
      // LocalGuard usually expects username and password in the body or headers
      // based on how passport-local is configured. By default it looks in the body.
      // Even for GET requests, supertest can send a body, though it's non-standard.
      return request(app.getHttpServer())
        .get('/user/find?id=1')
        .send({ username: 'doejohn@gmail.com', password: 'password123' })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: 1,
            name: 'John Doe',
            email: 'doejohn@gmail.com',
            password: 'password123',
          });
        });
    });

    it('should return 404 when users is not found', () => {
      return request(app.getHttpServer())
        .get('/user/find?id=999')
        .send({ username: 'doejohn@gmail.com', password: 'password123' })
        .expect(404);
    });

    it('should return 400 when ID is not a number', () => {
      return request(app.getHttpServer())
        .get('/user/find?id=abc')
        .send({ username: 'doejohn@gmail.com', password: 'password123' })
        .expect(400);
    });
  });
});
