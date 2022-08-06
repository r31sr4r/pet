import PetInMemoryRepository from '../../../infra/db/in-memory/pet-in-memory.repository';
import {CreatePetUseCase} from '../create-pet.use-case';

describe('CreatePetUseCase Unit Tests', () => {
	let useCase: CreatePetUseCase.UseCase;
	let repository: PetInMemoryRepository;

	beforeEach(() => {
		repository = new PetInMemoryRepository();
		useCase = new CreatePetUseCase.UseCase(repository);
	});

	it('should create a new pet', async () => {
		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			name: 'Tom',
			type: 'Cat',
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			id: repository.items[1].id,
			name: 'Tom',
			type: 'Cat',
			breed: null,
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
			created_at: repository.items[1].created_at,
		});

	});
});
