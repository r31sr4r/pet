import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { GroupSequelize } from '../../group-sequelize';
import { Group } from "#access/domain";
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';

const { GroupModel, GroupModelMapper } = GroupSequelize;

describe('GroupMapper Unit Tests', () => {

	setupSequelize({models: [GroupModel]});

	it('should throw an error when entity is invalid', async () => {
		const model = GroupModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
		try {
			GroupModelMapper.toEntity(model);
			fail('The group is valid but an error was expected');
		} catch (err) {
			expect(err).toBeInstanceOf(LoadEntityError);
			expect(err.error).toMatchObject({
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			});
			expect(err.message).toBe('An entity could not be loaded');
		}
	});

	it('should throw a generic error', async () => {
		const error = new Error('An error has occurred');
		const spyValidate = jest
			.spyOn(Group, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = GroupModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => GroupModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a group model to a group entity', async () => {
		const created_at = new Date();
		const model = GroupModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Group 1',
			description: 'Description 1',
			is_active: true,
			created_at,
		});
        
		const entity = GroupModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Group(
				{
					name: 'Group 1',
					description: 'Description 1',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});
});
