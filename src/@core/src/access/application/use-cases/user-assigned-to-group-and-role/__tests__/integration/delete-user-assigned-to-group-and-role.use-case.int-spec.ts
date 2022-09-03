import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { DeleteUserAssignedToGroupAndRoleUseCase } from '../../delete-user-assigned-to-group-and-role.use-case';
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
	let useCase: DeleteUserAssignedToGroupAndRoleUseCase.UseCase;

	setupSequelize({ models: [UserAssignedToGroupAndRoleModel,
		UserSequelize.UserModel,
		GroupSequelize.GroupModel,
		RoleSequelize.RoleModel
	] });

	beforeEach(() => {
		repository = new UserAssignedToGroupAndRoleSequelizeRepository(
			UserAssignedToGroupAndRoleModel
		);
		useCase = new DeleteUserAssignedToGroupAndRoleUseCase.UseCase(repository);
	});

	it('should throw an error when role not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a role', async () => {
		const model = await (await UserAssignedToGroupAndRoleModel.factory()).create();

		await useCase.execute({ id: model.id });
		const foundModel = await UserAssignedToGroupAndRoleModel.findByPk(model.id);

		expect(foundModel).toBeNull();
	});
});
