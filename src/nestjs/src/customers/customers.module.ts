import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerSequelize } from 'pet-core/customer/infra';
import { CUSTOMER_PROVIDERS } from './customers.providers';
import { UsersModule } from 'src/users/users.module';
import { PetSequelize } from 'pet-core/pet/infra';

@Module({
    imports: [
        SequelizeModule.forFeature([
            CustomerSequelize.CustomerModel,
            PetSequelize.PetModel,
        ]),
        UsersModule,
    ],
    controllers: [CustomersController],
    providers: [
        ...Object.values(CUSTOMER_PROVIDERS.REPOSITORIES),
        ...Object.values(CUSTOMER_PROVIDERS.USE_CASES),
    ],
})
export class CustomersModule {}
