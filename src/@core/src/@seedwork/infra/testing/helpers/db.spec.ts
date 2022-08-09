import { setupSequelize } from './db';
import {
	Table,
	Column,
	PrimaryKey,
	Model,
	DataType,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '../../sequelize/sequelize-model-factory'
import _chance from 'chance';

const chance = _chance();

@Table({ tableName: 'categories', timestamps: false })
class StubModel extends Model {
	@PrimaryKey
	@Column({ type: DataType.UUID })
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

describe('DbHelper Unit Tests', () => {
	const sequelizeConfig = setupSequelize({ models: [StubModel] });

	it('should define a model on beforeAll', async () => {
		expect(sequelizeConfig.sequelize).toBeDefined();
		expect(
			sequelizeConfig.sequelize.isDefined(StubModel.name)
		).toBeTruthy();
	});
});
