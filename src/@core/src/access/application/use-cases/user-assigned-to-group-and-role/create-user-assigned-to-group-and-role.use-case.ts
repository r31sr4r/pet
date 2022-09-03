import { default as DefaultUseCase } from '../../../../@seedwork/application/use-case';
import { UserAssignedToGroupAndRole } from '../../../domain/entities/user-assigned-to-group-and-role';
import UserAssignedToGroupAndRoleRepository from '../../../domain/repository/user-assigned-to-group-and-role.repository';
import {
	UserAssignedToGroupAndRoleOutput,
	UserAssignedToGroupAndRoleOutputMapper,
} from '../../dto/user-assigned-to-group-and-role-output';

export namespace CreateUserAssignedToGroupAndRoleUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = new UserAssignedToGroupAndRole(input);
			await this.userAssignedToGroupAndRoleRepository.insert(entity);
			return UserAssignedToGroupAndRoleOutputMapper.toOutput(entity);
		}
	}

	export type Input = {
		user_id: string;
		group_id: string;
		role_id: string;
	};

	export type Output = UserAssignedToGroupAndRoleOutput;
}

export default CreateUserAssignedToGroupAndRoleUseCase;
