import { default as DefaultUseCase } from '#seedwork/application/use-case';
import UserAssignedToGroupAndRoleRepository from '../../../domain/repository/user-assigned-to-group-and-role.repository';
import {
	UserAssignedToGroupAndRoleOutput,
	UserAssignedToGroupAndRoleOutputMapper,
} from '../../dto/user-assigned-to-group-and-role-output';

export namespace GetUserAssignedToGroupAndRoleUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private roleRepository: UserAssignedToGroupAndRoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.roleRepository.findById(input.id);
			return UserAssignedToGroupAndRoleOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		id: string;
	};

	export type Output = UserAssignedToGroupAndRoleOutput;
}

export default GetUserAssignedToGroupAndRoleUseCase;
