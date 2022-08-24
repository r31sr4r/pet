import { PetSequelize } from 'pet-core/pet/infra';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';
import { UserSequelize } from 'pet-core/user/infra';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: async (config: ConfigService<CONFIG_SCHEMA_TYPE>) => {
                const models = [
                    PetSequelize.PetModel,
                    UserSequelize.UserModel
                ];

                if (config.get('DB_VENDOR') === 'sqlite') {
                    return {
                        dialect: 'sqlite',
                        host: config.get('DB_HOST'),
                        models,
                        autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
                        logging: config.get('DB_LOGGING'),
                    };
                }

                if (config.get('DB_VENDOR') === 'mysql') {
                    return {
                        dialect: 'mysql',
                        host: config.get('DB_HOST'),
                        port: config.get('DB_PORT'),
                        database: config.get('DB_DATABASE'),
                        username: config.get('DB_USERNAME'),
                        password: config.get('DB_PASSWORD'),
                        models,
                        autoLoadModels: config.get('DB_AUTO_LOAD_MODELS'),
                        logging: config.get('DB_LOGGING'),
                    };
                }

                throw new Error('DB_VENDOR not supported');
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
