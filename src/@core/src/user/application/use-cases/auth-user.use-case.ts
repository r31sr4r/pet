import { UnauthorizedError } from '#seedwork/domain';
import { Crypt } from '#seedwork/infra/utils/crypt/index';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import UserRepository from '../../domain/repository/user.repository';
import {
	GroupRepository,
	RoleRepository,
	UserAssignedToGroupAndRoleRepository,
} from '#access/domain/repository';


export namespace AuthUserUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private userRepository: UserRepository.Repository,
			private groupRepository: GroupRepository.Repository,
			private roleRepository: RoleRepository.Repository,
			private userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			const entity = await this.userRepository.findByEmail(input.email);
			if (entity && (await Crypt.compare(input.password, entity.password))) {
				const profile =
					await this.userAssignedToGroupAndRoleRepository.search(
						new UserAssignedToGroupAndRoleRepository.SearchParams({
							filter: entity.id,
						})
					);
				if (profile.items.length > 0) {
					const groupsAndRoles: Promise<GroupsAndRoles>[] =
						profile.items.map(async (item) => {
							const group = await this.groupRepository.findById(
								item.props.group_id
							);
							const role = await this.roleRepository.findById(
								item.props.role_id
							);
							return {
								group: group.name,
								role: role.name,
							};
						});

					return {
						email: entity.email,
						profile: await Promise.all(groupsAndRoles),
					};
				}
			} else {
				throw new UnauthorizedError('Invalid credentials');
			}
		}
	}

	export type Input = {
		email: string;
		password: string;
	};

	export type Output = {
		email: string;
		profile: GroupsAndRoles[];
	};

	export type GroupsAndRoles = {
		group: string;
		role: string;
	};
}

export default AuthUserUseCase;
