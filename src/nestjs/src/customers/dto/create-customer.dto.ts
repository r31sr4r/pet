import { CreateCustomerUseCase } from 'pet-core/customer/application';

export class CreateCustomerDto implements CreateCustomerUseCase.Input {
    name: string;
    email: string;
    cellphone?: string;
    cpf?: string;
    gender?: string;
    birth_date?: Date;
    is_active?: boolean;
}
