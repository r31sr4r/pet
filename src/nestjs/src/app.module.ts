import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './pets/pets.module';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [ConfigModule.forRoot(), PetsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
