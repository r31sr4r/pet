import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { GetGroupUseCase } from '../../get-group.use-case';
import { GroupSequelize } from '#access/infra/db/sequelize/group-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { GroupSequelizeRepository, GroupModel } = GroupSequelize;
describe('DeleteGroupUseCase Integragion Tests', () => {
	let repository: GroupSequelize.GroupSequelizeRepository;
	let useCase: GetGroupUseCase.UseCase;

    setupSequelize({ models: [GroupModel] });

	beforeEach(() => {
		repository = new GroupSequelizeRepository(GroupModel);
		useCase = new GetGroupUseCase.UseCase(repository);
	});

	it('should throw an error when group not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a group', async () => {
		const model = await GroupModel.factory().create();

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
