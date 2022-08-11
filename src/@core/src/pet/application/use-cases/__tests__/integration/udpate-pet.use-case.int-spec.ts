import { UpdatePetUseCase } from '../../update-pet.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { Pet } from '../../../../domain/entities/pet';
import { setupSequelize } from '#seedwork/infra';
import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import _chance from 'chance';

const chance = _chance();

const { PetSequelizeRepository, PetModel } = PetSequelize;

describe('UpdatePetUseCase Integration Tests', () => {
	let useCase: UpdatePetUseCase.UseCase;
	let repository: PetSequelize.PetSequelizeRepository;

	setupSequelize({ models: [PetModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new UpdatePetUseCase.UseCase(repository);
	});

	it('should throw an error when pet not found', async () => {
		await expect(
			useCase.execute({ id: 'fake id', name: 'some name', type: 'fish' })
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
				birth_date?: Date | null;
			};
			expected: {
				id: string;
				name: string;
				type: string;
				breed: string;
				gender?: string;
				is_active: boolean;
				birth_date?: Date;
				created_at?: Date;
			};
		};

		const entity = await PetModel.factory().create();

		let output = await useCase.execute({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Toto',
			type: 'Dog',
			breed: null,
			gender: null,
			is_active: entity.is_active,
			birth_date: null,
			created_at: entity.created_at,
		});

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Titi',
					type: 'Dog',
					breed: 'Labrador',
					gender: null,
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Garfield',
					type: 'Cat',
					breed: null,
					gender: null,
					is_active: true,
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
					birth_date: new Date('2020-01-01'),
				},
				expected: {
					id: entity.id,
					name: 'Beta',
					type: 'Fish',
					breed: null,
					gender: null,
					is_active: false,
					birth_date: new Date('2020-01-01'),
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: null,
					gender: null,
					is_active: true,
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
				},
				expected: {
					id: entity.id,
					name: 'Taco',
					type: 'Dog',
					breed: 'Labrador',
					gender: 'Male',
					is_active: true,
					birth_date: null,
					created_at: entity.created_at,
				},
			},
		];



		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				type: item.input.type,
				breed: item.input.breed,
				gender: item.input.gender,
				is_active: item.input.is_active,
				birth_date: item.input.birth_date,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: item.expected.name,
				type: item.expected.type,
				breed: item.expected.breed,
				gender: item.expected.gender,
				is_active: item.expected.is_active,
				birth_date: item.expected.birth_date,
				created_at: item.expected.created_at,
			});
		}
	});
});
