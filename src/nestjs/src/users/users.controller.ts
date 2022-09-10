import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    AuthUserUseCase,
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
    HttpException,
    HttpStatus,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPresenter } from './presenter/user.presenter';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersService } from './users.service';
import { JwtPayload } from './dto/jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

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

    @Inject(AuthUserUseCase.UseCase)
    private authUserUseCase: AuthUserUseCase.UseCase;

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const output = await this.createUseCase.execute(createUserDto);
        return new UserPresenter(output);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.updateUseCase.execute({
            id,
            ...updateUserDto,
        });
    }

    @HttpCode(204)
    @Delete(':id')
    @UseGuards(AuthGuard())
    remove(@Param('id') id: string) {
        return this.deleteUseCase.execute({ id });
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async findOne(@Param('id') id: string) {
        const output = await this.getUseCase.execute({ id });
        return new UserPresenter(output);
    }

    @Get()
    @UseGuards(AuthGuard())
    async search(@Query() searchParams: SearchUserDto) {
        let users = await this.listUseCase.execute(searchParams);
        let usersItems = users.items.map((user) => {
            return new UserPresenter(user);
        });
        users.items = usersItems;

        return users;
    }

    @Post('/signin')
    @HttpCode(200)
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        try {
            const output: JwtPayload = await this.authUserUseCase.execute(
                authCredentialsDto,
            );
            if (output) {
                return this.usersService.signIn(output);
            }
        } catch (error) {
            if (error.message === 'Invalid credentials') {
                throw new UnauthorizedException('Invalid credentials');
            } else {
                throw new HttpException(
                    'Internal Server Error',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
