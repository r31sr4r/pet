import { ListUserAssignedToGroupRoleUseCase } from '../../list-user-assigned-to-group-and-role.use-case';
import { setupSequelize } from '#seedwork/infra';
import { UserAssignedToGroupAndRoleSequelize } from '#access/infra/db/sequelize/user-assigned-to-group-and-role-sequelize';
import _chance from 'chance';
import { UserSequelize } from '#user/infra';
import { GroupSequelize, RoleSequelize } from '#access/infra';

const chance = _chance();

const {
	UserAssignedToGroupAndRoleSequelizeRepository,
	UserAssignedToGroupAndRoleModel,
	UserAssignedToGroupAndRoleModelMapper,
} = UserAssignedToGroupAndRoleSequelize;

describe('ListUserAssignedToGroupRoleUseCase Integration Tests', () => {
	let repository: UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository;
	let useCase: ListUserAssignedToGroupRoleUseCase.UseCase;

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
		useCase = new ListUserAssignedToGroupRoleUseCase.UseCase(repository);
	});

	it('should return output with four roles ordered by created_at when input is empty', async () => {
		const models = await (await UserAssignedToGroupAndRoleModel.factory())
			.count(4)
			.bulkCreate();

		const output = await useCase.execute({});

		expect(output).toMatchObject({
			items: [...models].sort((a, b) => {
				return a.created_at.getTime() - b.created_at.getTime();
			}).reverse()
				.map(UserAssignedToGroupAndRoleModelMapper.toEntity)
				.map((i) => i.toJSON()),
			total: 4,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});
});
