import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { DeleteRoleUseCase } from '../../delete-role.use-case';
import { RoleSequelize } from '#access/infra/db/sequelize/role-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { RoleSequelizeRepository, RoleModel } = RoleSequelize;
describe('DeleteRoleUseCase Integragion Tests', () => {
	let repository: RoleSequelize.RoleSequelizeRepository;
	let useCase: DeleteRoleUseCase.UseCase;

    setupSequelize({ models: [RoleModel] });

	beforeEach(() => {
		repository = new RoleSequelizeRepository(RoleModel);
		useCase = new DeleteRoleUseCase.UseCase(repository);
	});

	it('should throw an error when role not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a role', async () => {
		const model = await RoleModel.factory().create();

		await useCase.execute({ id: model.id });
        const foundModel = await RoleModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
