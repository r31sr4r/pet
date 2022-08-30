import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { CustomerRepository } from '../../domain/repository/customer.repository';
import { CustomerOutput, CustomerOutputMapper } from '../dto/customer-output';

export namespace UpdateCustomerUseCase {
export class UseCase implements DefaultUseCase<Input, Output> {
	constructor(private customerRepository: CustomerRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.customerRepository.findById(input.id);
		entity.update(
			input.name,
			input.email,
			input.cellphone,
			input.cpf,
			input.gender,
			input.birth_date
		);

		if (input.is_active === true) {
			entity.activate();
		}

		if (input.is_active === false) {
			entity.deactivate();
		}

		await this.customerRepository.update(entity);
		return CustomerOutputMapper.toOutput(entity);
	}
}

export type Input = {
	id: string;
	name: string;
	email: string;	
	cellphone?: string;
	cpf?: string;
	gender?: string;
	birth_date?: Date;
	is_active?: boolean;
};

export type Output = CustomerOutput;

}

export default UpdateCustomerUseCase;