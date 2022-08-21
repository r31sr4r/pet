import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import UserRepository from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace GetUserUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(private userRepository: UserRepository.Repository) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.userRepository.findById(input.id);
			return UserOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = UserOutput;
}

export default GetUserUseCase;
