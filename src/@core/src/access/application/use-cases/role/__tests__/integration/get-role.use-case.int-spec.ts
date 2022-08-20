import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { GetRoleUseCase } from '../../get-role.use-case';
import { RoleSequelize } from '#access/infra/db/sequelize/role-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { RoleSequelizeRepository, RoleModel } = RoleSequelize;
describe('DeleteRoleUseCase Integragion Tests', () => {
	let repository: RoleSequelize.RoleSequelizeRepository;
	let useCase: GetRoleUseCase.UseCase;

    setupSequelize({ models: [RoleModel] });

	beforeEach(() => {
		repository = new RoleSequelizeRepository(RoleModel);
		useCase = new GetRoleUseCase.UseCase(repository);
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

		const foundModel = await useCase.execute({ id: model.id });

        expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			name: model.name,
			description: model.description,
			is_active: model.is_active,
			created_at: model.created_at,
		});
		
	});
});
