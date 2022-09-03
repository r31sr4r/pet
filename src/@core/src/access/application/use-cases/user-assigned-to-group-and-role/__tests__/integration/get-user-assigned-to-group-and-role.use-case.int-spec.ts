import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { GetUserAssignedToGroupAndRoleUseCase } from '../../get-user-assigned-to-group-and-role.use-case';
import { UserAssignedToGroupAndRoleSequelize } from '#access/infra/db/sequelize/user-assigned-to-group-and-role-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { UserSequelize } from '#user/infra';
import { GroupSequelize, RoleSequelize } from '#access/infra';

const {
	UserAssignedToGroupAndRoleSequelizeRepository,
	UserAssignedToGroupAndRoleModel,
} = UserAssignedToGroupAndRoleSequelize;

describe('DeleteUserAssignedToGroupAndRoleUseCase Integragion Tests', () => {
	let repository: UserAssignedToGroupAndRoleSequelize.UserAssignedToGroupAndRoleSequelizeRepository;
	let useCase: GetUserAssignedToGroupAndRoleUseCase.UseCase;

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
		useCase = new GetUserAssignedToGroupAndRoleUseCase.UseCase(repository);
	});

	it('should throw an error when role not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a role', async () => {
		const model = await (
			await UserAssignedToGroupAndRoleModel.factory()
		).create();

		const foundModel = await useCase.execute({ id: model.id });

		expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			user_id: model.user_id,
			group_id: model.group_id,
			role_id: model.role_id,
			created_at: model.created_at,
		});
	});
});
