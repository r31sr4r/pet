import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { User } from '../../domain/entities/user';
import UserRepository from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace CreateUserUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private userRepository: UserRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = new User(input);
			await this.userRepository.insert(entity);
			return UserOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		name: string;
		email: string;
		password: string;
		is_active?: boolean;
	};

	export type Output = UserOutput;
}

export default CreateUserUseCase;
