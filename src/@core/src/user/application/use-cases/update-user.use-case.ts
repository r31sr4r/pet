import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace UpdateUserUseCase {
export class UseCase implements DefaultUseCase<Input, Output> {
	constructor(private userRepository: UserRepository.Repository) {}

	async execute(input: Input): Promise<Output> {
		const entity = await this.userRepository.findById(input.id);
		entity.update(
			input.name,
			input.email			
		);

		if (input.is_active === true) {
			entity.activate();
		}

		if (input.is_active === false) {
			entity.deactivate();
		}

		await this.userRepository.update(entity);
		return UserOutputMapper.toOutput(entity);
	}

	async executeUpdatePassword(input: Input): Promise<Output> {
		const entity = await this.userRepository.findById(input.id);
		entity.updatePassword(input.old_password, input.password);
		await this.userRepository.update(entity);
		return UserOutputMapper.toOutput(entity);
	}
}

export type Input = {
	id: string;
	name: string;
	email: string;
	old_password?: string;
	password?: string;	
	is_active?: boolean;
};

export type Output = UserOutput;

}

export default UpdateUserUseCase;