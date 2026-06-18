import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/infrastructure/database/database.module';
import { createTestDatabaseModule } from '../helpers/test-database';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(createTestDatabaseModule())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/auth/signUp')
      .send({
        email: 'doejohn@gmail.com',
        password: 'password123',
        name: 'John Doe',
      })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'doejohn@gmail.com', password: 'password123' })
      .expect(201);

    accessToken = loginRes.body.accessToken;

    const meRes = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    userId = meRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/:id (GET)', () => {
    it('should return 401 Unauthorized when no credentials are provided', () => {
      return request(app.getHttpServer()).get('/user/1').expect(401);
    });

    it('should return 200 and the user when valid JWT and ID are provided', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: userId,
            name: 'John Doe',
          });
        });
    });

    it('should return 404 when user is not found', () => {
      return request(app.getHttpServer())
        .get('/user/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 400 when ID is not a number', () => {
      return request(app.getHttpServer())
        .get('/user/abc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });
});
