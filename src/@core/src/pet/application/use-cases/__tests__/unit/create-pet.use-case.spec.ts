import PetInMemoryRepository from '../../../../infra/db/in-memory/pet-in-memory.repository';
import {CreatePetUseCase} from '../../create-pet.use-case';

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
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe'
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
			gender: null,
			is_active: true,
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
			birth_date: null,
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			name: 'Tom',
			type: 'Cat',
			gender: 'Male',
			is_active: false,
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
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
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
			birth_date: new Date('2021-04-06'),
			created_at: repository.items[1].created_at,
		});

	});

	it('should throw an error if props is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity validation error'
		);
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be shorter than or equal to 100 characters',
				],
			},
		});

		await expect(useCase.execute({ name: '' } as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
				],
			},				
		});
	});

	it('should throw an error if type is not provided', async () => {
		await expect(useCase.execute({ 
			name: 'Test',
			type: null as any,
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe'
		})).rejects.toMatchObject({
			error: {
				type: [
					'type should not be empty',
					'type must be a string',
				],
			},
		});

	});
});
