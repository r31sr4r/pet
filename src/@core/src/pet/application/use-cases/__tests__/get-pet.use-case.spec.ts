import { Pet } from '../../../domain/entities/pet';
import NotFoundError from '../../../../@seedwork/domain/errors/not-found.error';
import PetInMemoryRepository from '../../../infra/db/in-memory/pet-in-memory.repository';
import {GetPetUseCase} from '../get-pet.use-case';

describe('GetPetUseCase Unit Tests', () => {
	let useCase: GetPetUseCase.UseCase;
	let repository: PetInMemoryRepository;

	beforeEach(() => {
		repository = new PetInMemoryRepository();
		useCase = new GetPetUseCase.UseCase(repository);
	});

	it('should throw an error when pet not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a pet', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new Pet({
				name: 'Toto',
                type: 'Dog',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Toto',
			type: 'Dog',
			breed: null,
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: repository.items[0].created_at,
		});
	});


});
