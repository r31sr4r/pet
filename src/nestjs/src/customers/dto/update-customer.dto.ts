import { UpdateCustomerUseCase } from 'pet-core/customer/application';
export class UpdateCustomerDto
    implements Omit<UpdateCustomerUseCase.Input, 'id'>
{
    name: string;
    email: string;
    cellphone?: string;
    cpf?: string;
    gender?: string;
    birth_date?: Date;
    is_active?: boolean;

}
