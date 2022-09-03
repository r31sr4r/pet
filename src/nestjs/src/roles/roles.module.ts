import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { ROLE_PROVIDERS } from './roles.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleSequelize } from 'pet-core/access/infra';

@Module({
    imports: [
        SequelizeModule.forFeature([
            RoleSequelize.RoleModel
        ])
    ],
    controllers: [RolesController],
    providers: [
        ...Object.values(ROLE_PROVIDERS.REPOSITORIES),
        ...Object.values(ROLE_PROVIDERS.USE_CASES)       
        
    ],
})
export class RolesModule {}
