import { Pet } from '#pet/domain';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { Customer } from '../../domain/entities/customer';
import CustomerRepository from '../../domain/repository/customer.repository';
import { CustomerOutput, CustomerOutputMapper } from '../dto/customer-output';

export namespace CreateCustomerUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private customerRepository: CustomerRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = new Customer(input);
			await this.customerRepository.insert(entity);
			return CustomerOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		email: string;	
		cellphone?: string;
		cpf?: string;
		gender?: string;
		birth_date?: Date;
		is_active?: boolean;
		pets?: Pet[];
	};

	export type Output = CustomerOutput;
}

export default CreateCustomerUseCase;
