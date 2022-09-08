import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateUserUseCase } from '../../create-user.use-case';
import { ValidationError } from '#seedwork/domain';
import {
	GroupSequelize,
	RoleSequelize,
	UserAssignedToGroupAndRoleSequelize,
} from '#access/infra';
import { Group, Role } from '#access/domain';
import { CustomerSequelize } from '#customer/infra';
import { PetSequelize } from '#pet/infra';

const { UserSequelizeRepository, UserModel } = UserSequelize;
const { GroupSequelizeRepository, GroupModel } = GroupSequelize;
const { RoleSequelizeRepository, RoleModel } = RoleSequelize;
const { CustomerSequelizeRepository, CustomerModel } = CustomerSequelize;
const { PetModel } = PetSequelize;
const {
	UserAssignedToGroupAndRoleSequelizeRepository,
	UserAssignedToGroupAndRoleModel,
} = UserAssignedToGroupAndRoleSequelize;

describe('CreateUserUseCase Integrations Tests', () => {
	let useCase: CreateUserUseCase.UseCase;
	let repository: UserSequelize.UserSequelizeRepository;
	let groupRepository: GroupSequelize.GroupSequelizeRepository;
	let roleRepository: RoleSequelize.RoleSequelizeRepository;
	let userAssignedToGroupAndRoleRepository: UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository;
	let customerRepository: CustomerSequelize.CustomerSequelizeRepository;

	setupSequelize({
		models: [
			UserModel,
			GroupModel,
			RoleModel,
			UserAssignedToGroupAndRoleModel,
			CustomerModel,
			PetModel,
		],
	});

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		groupRepository = new GroupSequelizeRepository(GroupModel);
		roleRepository = new RoleSequelizeRepository(RoleModel);
		userAssignedToGroupAndRoleRepository =
			new UserAssignedToGroupAndRoleSequelizeRepository(
				UserAssignedToGroupAndRoleModel
			);
		customerRepository = new CustomerSequelizeRepository(CustomerModel);
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
			name: 'customer',
			description: 'some-group-description',
		});

		await groupRepository.insert(group);

		const role = new Role({
			name: 'some-role-name',
			description: 'some-role-description',
		});

		await roleRepository.insert(role);

		let output = await useCase.execute({
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: 'Somepass1',
			group: group.name,
			role: role.name,
		});

		let user = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: user.id,
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: user.props.password,
			is_active: true,
			group: group.name,
			role: role.name,
			created_at: user.props.created_at,
		});

		output = await useCase.execute({
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: 'Somepass2',
			is_active: false,
			group: group.name,
			role: role.name,
		});

		user = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: user.id,
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: user.props.password,
			is_active: false,
			group: group.name,
			role: role.name,
			created_at: user.props.created_at,
		});
	});

	it('should throw an error if email is already registered', async () => {
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

		await useCase.execute({
			name: 'Marky Ramone',
			email: 'mark.ramone@mail.com',
			password: 'Somepass1',
			group: group.name,
			role: role.name,
		});
		await expect(
			useCase.execute({
				name: 'Marky not Ramone',
				email: 'mark.ramone@mail.com',
				password: 'Somepass2',
				group: group.name,
				role: role.name,
			})
		).rejects.toThrowError(
			new ValidationError(
				`Entity already exists using email mark.ramone@mail.com`
			)
		);
	});
});
