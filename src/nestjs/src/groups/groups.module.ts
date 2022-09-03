import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GROUP_PROVIDERS } from './groups.providers';
import { SequelizeModule } from '@nestjs/sequelize';
import { GroupSequelize } from 'pet-core/access/infra';

@Module({
    imports: [
        SequelizeModule.forFeature([
            GroupSequelize.GroupModel
        ])
    ],
    controllers: [GroupsController],
    providers: [
        ...Object.values(GROUP_PROVIDERS.REPOSITORIES),
        ...Object.values(GROUP_PROVIDERS.USE_CASES)       
        
    ],
})
export class GroupsModule {}
