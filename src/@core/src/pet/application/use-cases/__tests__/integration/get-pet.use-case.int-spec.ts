import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { GetPetUseCase } from '../../get-pet.use-case';
import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { PetSequelizeRepository, PetModel } = PetSequelize;
describe('DeletePetUseCase Integragion Tests', () => {
	let repository: PetSequelize.PetSequelizeRepository;
	let useCase: GetPetUseCase.UseCase;

    setupSequelize({ models: [PetModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new GetPetUseCase.UseCase(repository);
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

		const foundModel = await useCase.execute({ id: model.id });

        expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			name: model.name,
			type: model.type,
			breed: model.breed,
			gender: model.gender,
			birth_date: model.birth_date,
			is_active: model.is_active,
			created_at: model.created_at,
		});
		
	});
});
