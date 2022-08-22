import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PET_PROVIDERS } from './users.providers';
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
        UsersService,
        ...Object.values(PET_PROVIDERS.REPOSITORIES),
        ...Object.values(PET_PROVIDERS.USE_CASES)       
        
    ],
})
export class UsersModule {}
