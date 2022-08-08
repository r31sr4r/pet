import { LoadEntityError } from '#seedwork/domain';
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
});
