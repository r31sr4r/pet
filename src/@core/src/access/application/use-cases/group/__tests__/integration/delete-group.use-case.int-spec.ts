import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { DeleteGroupUseCase } from '../../delete-group.use-case';
import { GroupSequelize } from '#access/infra/db/sequelize/group-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { GroupSequelizeRepository, GroupModel } = GroupSequelize;
describe('DeleteGroupUseCase Integragion Tests', () => {
	let repository: GroupSequelize.GroupSequelizeRepository;
	let useCase: DeleteGroupUseCase.UseCase;

    setupSequelize({ models: [GroupModel] });

	beforeEach(() => {
		repository = new GroupSequelizeRepository(GroupModel);
		useCase = new DeleteGroupUseCase.UseCase(repository);
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

		await useCase.execute({ id: model.id });
        const foundModel = await GroupModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
