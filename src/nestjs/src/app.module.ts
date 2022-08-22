import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [ConfigModule.forRoot(), PetsModule, DatabaseModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
