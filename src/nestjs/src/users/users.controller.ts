import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
} from 'pet-core/user/application';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Inject,
    Put,
    HttpCode,
    Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    @Inject(CreateUserUseCase.UseCase)
    private createUseCase: CreateUserUseCase.UseCase;

    @Inject(UpdateUserUseCase.UseCase)
    private updateUseCase: UpdateUserUseCase.UseCase;

    @Inject(DeleteUserUseCase.UseCase)
    private deleteUseCase: DeleteUserUseCase.UseCase;

    @Inject(GetUserUseCase.UseCase)
    private getUseCase: GetUserUseCase.UseCase;

    @Inject(ListUsersUseCase.UseCase)
    private listUseCase: ListUsersUseCase.UseCase;

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.createUseCase.execute(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.updateUseCase.execute({
            id,
            ...updateUserDto,
        });
    }

    @HttpCode(204)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.getUseCase.execute({ id });
    }

    @Get()
    search(@Query() searchParams: SearchUserDto) {
        return this.listUseCase.execute(searchParams);
    }
}
