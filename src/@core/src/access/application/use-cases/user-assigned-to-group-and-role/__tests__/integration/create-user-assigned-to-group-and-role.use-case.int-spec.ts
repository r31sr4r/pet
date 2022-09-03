import { GroupSequelize, RoleSequelize } from '#access/infra';
import { UserAssignedToGroupAndRoleSequelize } from '#access/infra/db/sequelize/user-assigned-to-group-and-role-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { UserSequelize } from '#user/infra';
import { CreateUserAssignedToGroupAndRoleUseCase } from '../../create-user-assigned-to-group-and-role.use-case';

const {
	UserAssignedToGroupAndRoleSequelizeRepository,
	UserAssignedToGroupAndRoleModel,
} = UserAssignedToGroupAndRoleSequelize;

describe('CreateUserAssignedToGroupAndRoleUseCase Integrations Tests', () => {
	let useCase: CreateUserAssignedToGroupAndRoleUseCase.UseCase;
	let repository: UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository;

	setupSequelize({
		models: [
			UserAssignedToGroupAndRoleModel,
			UserSequelize.UserModel,
			GroupSequelize.GroupModel,
			RoleSequelize.RoleModel,
		],
	});

	beforeEach(() => {
		repository = new UserAssignedToGroupAndRoleSequelizeRepository(
			UserAssignedToGroupAndRoleModel
		);
		useCase = new CreateUserAssignedToGroupAndRoleUseCase.UseCase(
			repository
		);
	});

	it('should create a new UserAssignedToGroupAndRole', async () => {
		const user = await UserSequelize.UserModel.factory().create();
		const group = await GroupSequelize.GroupModel.factory().create();
		const role = await RoleSequelize.RoleModel.factory().create();

		let output = await useCase.execute({
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
		});

		let userAssignedToGroupAndRole = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: userAssignedToGroupAndRole.id,
			user_id: user.id,
			group_id: group.id,
			role_id: role.id,
			created_at: userAssignedToGroupAndRole.props.created_at,
		});
	});
});
