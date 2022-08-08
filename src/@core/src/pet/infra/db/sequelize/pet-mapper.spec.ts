import { Pet } from '#pet/domain';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { Sequelize } from 'sequelize-typescript';
import PetModelMapper from './pet-mapper';
import { PetModel } from './pet-model';

describe('PetMapper Unit Tests', () => {
	let sequelize: Sequelize;

	beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			host: ':memory:',
			logging: false,
			models: [PetModel],
		});
	});

	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should throw an error when entity is invalid', async () => {
		const model = PetModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
        try {
            PetModelMapper.toEntity(model);
            fail('The pet is valid but an error was expected');            
        } catch (err) {
            expect(err).toBeInstanceOf(LoadEntityError);            
            expect(err.error).toMatchObject({
                name: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 100 characters',
                ]
            });
            expect(err.message).toBe('An entity could not be loaded');            
        }
	});


	it('should throw a generic error', async () => {
		const error = new Error('An error has occurred');
		const spyValidate = jest
			.spyOn(Pet, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = PetModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => PetModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a pet model to a pet', async () => {
		const created_at = new Date();
		const model = PetModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Pet 1',
			type: 'dog',
			is_active: true,
			created_at,
		});
        
		const entity = PetModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Pet(
				{
					name: 'Pet 1',
					type: 'dog',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});
});
