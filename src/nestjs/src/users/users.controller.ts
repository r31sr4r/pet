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
import { UserPresenter } from './presenter/user.presenter';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

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
    async create(@Body() createUserDto: CreateUserDto) {
        const output = await this.createUseCase.execute(createUserDto);
        return new UserPresenter(output);
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
    async findOne(@Param('id') id: string) {
        const output = await this.getUseCase.execute({ id });
        return new UserPresenter(output);
    }

    @Get()
    async search(@Query() searchParams: SearchUserDto) {
        let users = await this.listUseCase.execute(searchParams);
        let usersItems = users.items.map((user) => {
            return new UserPresenter(user);
        });
        users.items = usersItems;      

        return users;
    }

    @Post('/signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }    
}
