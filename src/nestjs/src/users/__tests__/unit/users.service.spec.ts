import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../../users.module';

describe('UserService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, JwtService, UsersModule],
        }).compile();        

        service = module.get<UsersService>(UsersService);

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a valid token', async () => {
        const user = { id: 1, username: 'test' };
        const token = await service.signIn(user);
        expect(token).toBeDefined();
        expect(token.accessToken).toBeDefined();
    });
});
