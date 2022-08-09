import {
	Table,
	Column,
	PrimaryKey,
	Model,
	DataType,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from './sequelize-model-factory';
import _chance from 'chance';
import { validate as uuidValidate } from 'uuid';
import { setupSequelize } from '../testing/helpers/db';

const chance = _chance();

@Table({ })
class StubModel extends Model {
	@PrimaryKey
	@Column({ allowNull: false, type: DataType.UUID })
	declare id;

	@Column({ allowNull: false, type: DataType.STRING })
	declare name;

	static mockFactory = jest.fn(() => ({
		id: chance.guid({ version: 4 }),
		name: chance.word(),
	}));

	static factory() {
		return new SequelizeModelFactory<
			StubModel,
			{ id: string; name: string }
		>(StubModel, StubModel.mockFactory);
	}
}

describe('SequelizeModelFactory Unit Tests', () => {
	setupSequelize({ models: [StubModel] });

	test('create method', async () => {
		let model = await StubModel.factory().create();
		expect(uuidValidate(model.id)).toBeTruthy();
		expect(model.name).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalled();

		let modelFound = await StubModel.findByPk(model.id);
		expect(model.id).toBe(modelFound.id);

		model = await StubModel.factory().create({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'test',
		});
		expect(model.id).toBe('02b090cf-5658-4073-b242-9bf64915b3ad');
		expect(model.name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

		modelFound = await StubModel.findByPk(model.id);
		expect(model.id).toBe(modelFound.id);
	});

	test('make method', () => {
		let model = StubModel.factory().make();
		expect(uuidValidate(model.id)).toBeTruthy();
		expect(model.name).not.toBeNull();
		expect(model.id).not.toBeNull();
		expect(StubModel.mockFactory).toHaveBeenCalled();

		model = StubModel.factory().make({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'test',
		});

		expect(model.id).toBe('02b090cf-5658-4073-b242-9bf64915b3ad');
		expect(model.name).toBe('test');
		expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
	});
});
