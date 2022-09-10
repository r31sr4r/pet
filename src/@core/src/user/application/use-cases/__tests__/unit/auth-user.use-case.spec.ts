import { User } from '../../../../domain/entities/user';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import { AuthUserUseCase } from '../../auth-user.use-case';
import {
	GroupInMemoryRepository,
	RoleInMemoryRepository,
	UserAssignedToGroupAndRoleInMemoryRepository,
} from '#access/infra';
import { UnauthorizedError } from '#seedwork/domain';
import { Group, Role, UserAssignedToGroupAndRole } from '#access/domain';

describe('AuthUserUseCase Unit Tests', () => {
	let useCase: AuthUserUseCase.UseCase;
	let repository: UserInMemoryRepository;
	let groupRepository: GroupInMemoryRepository;
	let roleRepository: RoleInMemoryRepository;
	let userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		groupRepository = new GroupInMemoryRepository();
		roleRepository = new RoleInMemoryRepository();
		userAssignedToGroupAndRoleRepository =
			new UserAssignedToGroupAndRoleInMemoryRepository();
		useCase = new AuthUserUseCase.UseCase(
			repository,
			groupRepository,
			roleRepository,
			userAssignedToGroupAndRoleRepository
		);
	});

	it('should throw an error when user not found', async () => {
		await expect(
			useCase.execute({ email: 'fake email', password: 'fake pass' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using email fake email')
		);
	});

	it('should throw an error when password is wrong', async () => {
		const user = new User({
			name: 'Tony Stark',
			email: 'toto@mail.com',
			password: 'Password1',
		});
		await repository.insert(user);
		await expect(
			useCase.execute({ email: user.email, password: 'wrong pass' })
		).rejects.toThrow(new UnauthorizedError('Invalid credentials'));
	});

	it('should return a user', async () => {
		const group = new Group({
			name: 'customer',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
		let items = [
			new User({
				name: 'Tony Stark',
				email: 'toto@mail.com',
				password: 'Password1',
			}),
		];

		repository.items = items;

		let userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: items[0].id,
			group_id: group.id,
			role_id: role.id,
		});

		await userAssignedToGroupAndRoleRepository.insert(
			userAssignedToGroupAndRole
		);

		let output = await useCase.execute({
			email: items[0].email,
			password: 'Password1',
		});

		expect(spyFindByEmail).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			email: 'toto@mail.com',
			profile: [
				{
					group: group.name,
					role: role.name,
				},
			],
		});

		const group2 = new Group({
			name: 'vet',
			description: 'vet-group-description',
		});

		await groupRepository.insert(group2);

		userAssignedToGroupAndRole = new UserAssignedToGroupAndRole({
			user_id: items[0].id,
			group_id: group2.id,
			role_id: role.id,
		});

		await userAssignedToGroupAndRoleRepository.insert(
			userAssignedToGroupAndRole
		);

		output = await useCase.execute({
			email: items[0].email,
			password: 'Password1',
		});

		expect(spyFindByEmail).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			email: 'toto@mail.com',
			profile: [
				{
					group: group2.name,
					role: role.name,
				},
				{
					group: group.name,
					role: role.name,
				},
			],
		});
	});
});
