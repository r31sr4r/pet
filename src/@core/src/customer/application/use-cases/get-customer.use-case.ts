import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import CustomerRepository from '../../domain/repository/customer.repository';
import { CustomerOutput, CustomerOutputMapper } from '../dto/customer-output';

export namespace GetCustomerUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private customerRepository: CustomerRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.customerRepository.findById(input.id);
			return CustomerOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = CustomerOutput;
}

export default GetCustomerUseCase;
