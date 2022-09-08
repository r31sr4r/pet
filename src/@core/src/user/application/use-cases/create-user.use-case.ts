import { UserAssignedToGroupAndRole } from '#access/domain/entities';
import {
	GroupRepository,
	RoleRepository,
	UserAssignedToGroupAndRoleRepository,
} from '#access/domain/repository';
import { Customer, CustomerRepository } from '#customer/domain';
import { NotFoundError, UniqueEntityId } from '#seedwork/domain';
import { default as DefaultUseCase } from '../../../@seedwork/application/use-case';
import { User } from '../../domain/entities/user';
import UserRepository from '../../domain/repository/user.repository';
import { UserOutput, UserOutputMapper } from '../dto/user-output';

export namespace CreateUserUseCase {
	export class UseCase implements DefaultUseCase<Input, Output> {
		constructor(
			private userRepository: UserRepository.Repository,
			private groupRepository: GroupRepository.Repository,
			private roleRepository: RoleRepository.Repository,
			private userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleRepository.Repository,
			private customerRepository: CustomerRepository.Repository
		) {}

		async execute(input: Input): Promise<Output> {
			let group_id;
			let role_id;

			({ group_id, role_id } = await this.ValidateGroupAndRole(
				input,
				group_id,
				role_id
			));

			const entity = new User(input);
			await this.userRepository.insert(entity);
			const userMapped = UserOutputMapper.toOutput(entity);

			await this.AssignUserToGroupAndRole(userMapped, group_id, role_id);

			this.InsertDataByGroup(input, userMapped);

			return userMapped;
		}

		private InsertDataByGroup(input: Input, userMapped: UserOutput) {
			if (input.group === 'customer') {
				const customer = new Customer({					
					name: input.name,					
					email: input.email,					
				}, new UniqueEntityId(userMapped.id));
				this.customerRepository.insert(customer);
			} else if (input.group === 'vet') {
				// Insert data to vet table
			}
		}

		private async ValidateGroupAndRole(
			input: Input,
			group_id: any,
			role_id: any
		) {
			if (input) {
				const group = await this.groupRepository.search(
					new GroupRepository.SearchParams({
						filter: input.group,
					})
				);
				if (group.items.length === 0) {
					throw new NotFoundError('Group not found');
				}
				group_id = group.items[0].id;

				const role = await this.roleRepository.search(
					new RoleRepository.SearchParams({
						filter: input.role,
					})
				);
				if (role.items.length === 0) {
					throw new NotFoundError('Role not found');
				}
				role_id = role.items[0].id;
			}
			return { group_id, role_id };
		}

		private async AssignUserToGroupAndRole(
			userMapped: UserOutput,
			group_id: string,
			role_id: string
		) {
			const userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
				user_id: userMapped.id,
				group_id: group_id,
				role_id: role_id,
			});

			await this.userAssignedToGroupAndRoleRepository.insert(
				userAssignedToGroupAndRole
			);
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
