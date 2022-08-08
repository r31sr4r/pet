import { Pet } from '#pet/domain';
import { NotFoundError } from '#seedwork/domain';
import { Sequelize } from 'sequelize-typescript';
import { PetModel } from './pet-model';
import { PetSequelizeRepository } from './pet-repository';

describe('PetRepository Unit Tests', () => {
	let sequelize: Sequelize;
	let repository: PetSequelizeRepository;

	beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			host: ':memory:',
			logging: false,
			models: [PetModel],
		});
	});

	beforeEach(async () => {
		repository = new PetSequelizeRepository(PetModel);
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
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
    
});
