import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { DeletePetUseCase } from '../../delete-pet.use-case';
import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { PetSequelizeRepository, PetModel } = PetSequelize;
describe('DeletePetUseCase Integragion Tests', () => {
	let repository: PetSequelize.PetSequelizeRepository;
	let useCase: DeletePetUseCase.UseCase;

    setupSequelize({ models: [PetModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new DeletePetUseCase.UseCase(repository);
	});

	it('should throw an error when pet not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a pet', async () => {
		const model = await PetModel.factory().create();

		await useCase.execute({ id: model.id });
        const foundModel = await PetModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
