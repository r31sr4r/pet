import { CreateUserUseCase } from 'pet-core/user/application';

export class CreateUserDto implements CreateUserUseCase.Input {
    name: string;
    email: string;
    password: string;    
    is_active?: boolean;
    group: string;
    role: string;
}
