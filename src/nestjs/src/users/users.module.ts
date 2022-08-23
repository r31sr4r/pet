import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { USER_PROVIDERS } from './users.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSequelize } from 'pet-core/user/infra';

@Module({
    imports: [
        SequelizeModule.forFeature([
            UserSequelize.UserModel
        ])
    ],
    controllers: [UsersController],
    providers: [
        ...Object.values(USER_PROVIDERS.REPOSITORIES),
        ...Object.values(USER_PROVIDERS.USE_CASES)       
        
    ],
})
export class UsersModule {}
