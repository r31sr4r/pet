import PetInMemoryRepository from '../../../../infra/db/in-memory/pet-in-memory.repository';
import { UpdatePetUseCase } from '../../update-pet.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { Pet } from '../../../../domain/entities/pet';

describe('UpdatePetUseCase Unit Tests', () => {
	let useCase: UpdatePetUseCase.UseCase;
	let repository: PetInMemoryRepository;

	beforeEach(() => {
		repository = new PetInMemoryRepository();
		useCase = new UpdatePetUseCase.UseCase(repository);
	});

	it('should throw an error when pet not found', async () => {
		await expect(
			useCase.execute({
				id: 'fake id',
				name: 'some name',
				type: 'fish',
				customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
			})
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should update a pet', async () => {
		type Arrange = {
			input: {
				id: string;
				name: string;
				type: string;
				breed?: string | null;
				gender?: string | null;
				is_active?: boolean | null;
				customer_id: string;
				birth_date?: Date | null;
			};
			expected: {
				id: string;
				name: string;
				type: string;
				breed: string;
				gender?: string;
				is_active: boolean;
				customer_id: string;
				birth_date?: Date;
				created_at?: Date;
			};
		};

		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new Pet({
			name: 'Toto',
			type: 'Dog',
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
		});
		repository.items = [entity];

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
				},
				expected: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
					gender: null,
					is_active: true,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
				},
				expected: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
					breed: null,
					gender: null,
					is_active: true,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Beta',
					type: 'Fish',
					is_active: false,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: new Date('2020-01-01'),
				},
				expected: {
					id: entity.id,
					name: 'Beta',
					type: 'Fish',
					breed: null,
					gender: null,
					is_active: false,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: new Date('2020-01-01'),
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: null,
					gender: null,
					is_active: false,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: 'Labrador',
					gender: 'Male',
					is_active: true,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: 'Labrador',
					gender: 'Male',
					is_active: true,
					customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
					birth_date: null,
					created_at: entity.created_at,
				},
			},
		];

		let output = await useCase.execute({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
			breed: null,
			gender: null,
			is_active: true,
			customer_id: 'f7e4835f-311e-47f2-aa44-908c89649ebe',
			birth_date: null,
			created_at: entity.created_at,
		});
		expect(spyUpdate).toHaveBeenCalledTimes(1);

		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				type: item.input.type,
				breed: item.input.breed,
				gender: item.input.gender,
				is_active: item.input.is_active,
				customer_id: item.input.customer_id,
				birth_date: item.input.birth_date,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: item.expected.name,
				type: item.expected.type,
				breed: item.expected.breed,
				gender: item.expected.gender,
				is_active: item.expected.is_active,
				customer_id: item.expected.customer_id,
				birth_date: item.expected.birth_date,
				created_at: item.expected.created_at,
			});
		}
	});
});
