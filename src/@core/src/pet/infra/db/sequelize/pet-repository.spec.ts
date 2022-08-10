import { Pet, PetRepository } from '#pet/domain';
import { NotFoundError } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { PetModel } from './pet-model';
import { PetSequelizeRepository } from './pet-repository';
import _chance from 'chance';

describe('PetRepository Unit Tests', () => {
	setupSequelize({models: [PetModel]});
	let chance: Chance.Chance;
	let repository: PetSequelizeRepository;

	beforeAll(() => {
		chance = _chance();
	});


	beforeEach(async () => {
		repository = new PetSequelizeRepository(PetModel);
	});

	it('should insert a pet', async () => {
		let pet = new Pet({
			name: 'Pet 1',
			type: 'dog',
		});
		await repository.insert(pet);
		let model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());

		pet = new Pet({
			name: 'Pet 2',
			type: 'cat',
			is_active: false,
		});

		await repository.insert(pet);
		model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());

		pet = new Pet({
			name: 'Pet 3',
			type: 'dog',
			breed: 'labrador',
			gender: 'Male',
			birth_date: new Date('2021-04-06')
		});

		await repository.insert(pet);
		model = await PetModel.findByPk(pet.id);
		expect(model.toJSON()).toStrictEqual(pet.toJSON());
	});

    it('should throw an error when entity has not been found', async () => {
		await expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
		await expect(
			repository.findById('312cffad-1938-489e-a706-643dc9a3cfd3')
		).rejects.toThrow(
			new NotFoundError(
				'Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3'
			)
		);
	});

    it('should find an entity by Id', async () => {
		const entity = new Pet({ name: 'some name', type: 'dog' });
		await repository.insert(entity);

		let entityFound = await repository.findById(entity.id);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());

		entityFound = await repository.findById(entity.uniqueEntityId);
		expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
	});

	it('should find all entities', async () => {
		const entity1 = new Pet({ name: 'Toto', type: 'dog' });
		const entity2 = new Pet({ name: 'Garfield', type: 'cat' });
		const entity3 = new Pet({ name: 'some name', type: 'dog' });
		await repository.insert(entity1);
		await repository.insert(entity2);
		await repository.insert(entity3);

		const entities = await repository.findAll();
		expect(entities.length).toBe(3);
		expect(entities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(entities[1].toJSON()).toStrictEqual(entity2.toJSON());
		expect(entities[2].toJSON()).toStrictEqual(entity3.toJSON());
	});

	describe('search method tests', () => {
		it('should apply only paginate when other params are not provided', async () => {
			await PetModel.factory()
				.count(16)
				.bulkCreate(() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word(),
					type: chance.animal({ type: 'pet' }),
					breed: null,
					gender: null,
					birth_date: null,
					is_active: chance.bool(),
					created_at: chance.date(),
				}));

			const searchOutput = await repository.search(
				new PetRepository.SearchParams()
			);

			expect(searchOutput).toBeInstanceOf(
				PetRepository.SearchResult
			);
			expect(searchOutput.toJSON()).toMatchObject({
				total: 16,
				current_page: 1,
				last_page: 2,
				per_page: 15,
				sort: null,
				sort_dir: null,
				filter: null,
			});

			searchOutput.items.forEach((item) => {
				expect(item).toBeInstanceOf(Pet);
				expect(item.id).toBeDefined();
			});
		});
	});
    
});
