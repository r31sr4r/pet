import { Group, Role } from '#access/domain';
import { GroupInMemoryRepository, RoleInMemoryRepository, UserAssignedToGroupAndRoleInMemoryRepository } from '#access/infra';
import { CustomerInMemoryRepository } from '#customer/infra';
import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import { CreateUserUseCase } from '../../create-user.use-case';

describe('CreateUserUseCase Unit Tests', () => {
	let useCase: CreateUserUseCase.UseCase;
	let repository: UserInMemoryRepository;
	let groupRepository: GroupInMemoryRepository;
	let roleRepository: RoleInMemoryRepository;
	let userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleInMemoryRepository;
	let customerRepository: CustomerInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		groupRepository = new GroupInMemoryRepository();
		roleRepository = new RoleInMemoryRepository();
		userAssignedToGroupAndRoleRepository = new UserAssignedToGroupAndRoleInMemoryRepository();
		customerRepository = new CustomerInMemoryRepository();
		useCase = new CreateUserUseCase.UseCase(
			repository,
			groupRepository,
			roleRepository,
			userAssignedToGroupAndRoleRepository,
			customerRepository
		);
	});

	it('should throw an error if group does not exist', async () => {
		await expect(
			useCase.execute({
				name: 'Test User',
				email: 'test@mail.com',
				password: 'Somepass1',
				group: 'some-group-name',
				role: 'some-role-name',
			})
		).rejects.toThrowError('Group not found');
	});

	it('should throw an error if role does not exist', async () => {
		const group = new Group({
			name: 'some-group-name',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		await expect(
			useCase.execute({
				name: 'Test User',
				email: 'test@mail.com',
				password: 'Somepass1',
				group: group.name,
				role: 'some-role-name',
			})
		).rejects.toThrowError('Role not found');
	});

	it('should create a new user', async () => {
		const group = new Group({
			name: 'some-group-name',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: 'Somepass1',
			group: group.name,
			role: role.name,
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: repository.items[0].password,
			is_active: true,
			group: group.name,
			role: role.name,
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: 'Somepass2',
			is_active: false,
			group: group.name,
			role: role.name,
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			id: repository.items[1].id,
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: repository.items[1].password,
			is_active: false,
			group: group.name,
			role: role.name,
			created_at: repository.items[1].created_at,
		});
	});

	it('should throw an error if props is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity validation error'
		);
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			},
		});

		const group = new Group({
			name: 'some-group-name',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		await expect(
			useCase.execute({
				name: '',
				group: group.name,
				role: role.name,
			} as any)
		).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be longer than or equal to 3 characters',
				],
			},
		});
	});

	it('should throw an error if email is not provided', async () => {
		const group = new Group({
			name: 'some-group-name',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		await expect(
			useCase.execute({
				name: 'Test',
				email: null as any,
				password: 'Somepass1',
				group: group.name,
				role: role.name,
			})
		).rejects.toMatchObject({
			error: {
				email: [
					'email should not be empty',
					'email must be a string',
					'email must be shorter than or equal to 255 characters',
					'email must be an email',
				],
			},
		});
	});

	it('should throw an error if password is not provided', async () => {
		const group = new Group({
			name: 'some-group-name',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		await expect(
			useCase.execute({
				name: 'Test',
				email: 'somemail@mail.com',
				password: null as any,
				group: group.name,
				role: role.name,
			})
		).rejects.toMatchObject({
			error: {
				password: [
					'Password too weak. Use at least one uppercase letter, one lowercase letter, one number or one special character',
					'password must be longer than or equal to 6 characters',
				],
			},
		});
	});
});
