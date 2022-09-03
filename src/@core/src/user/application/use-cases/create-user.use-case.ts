import { GroupRepository, RoleRepository } from '#access/domain';
import { NotFoundError } from '#seedwork/domain';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { User } from '../../domain/entities/user';
import UserRepository from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace CreateUserUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private userRepository: UserRepository.Repository,
			private groupRepository: GroupRepository.Repository,
			private roleRepository: RoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			if (input) {
				const group = await this.groupRepository.search(
					new GroupRepository.SearchParams({
						filter: input.group,
					})
				);
				if (group.items.length === 0) {
					throw new NotFoundError('Group not found');
				}

				const role = await this.roleRepository.search(
					new RoleRepository.SearchParams({
						filter: input.role,
					})
				);
				if (role.items.length === 0) {
					throw new NotFoundError('Role not found');
				}
			}

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
		group: string;
		role: string;
	};

	export type Output = UserOutput;
}

export default CreateUserUseCase;
