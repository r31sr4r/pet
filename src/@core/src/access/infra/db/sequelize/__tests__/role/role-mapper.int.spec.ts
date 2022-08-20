import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { RoleSequelize } from '../../role-sequelize';
import { Role } from "#access/domain";
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';

const { RoleModel, RoleModelMapper } = RoleSequelize;

describe('RoleMapper Unit Tests', () => {

	setupSequelize({models: [RoleModel]});

	it('should throw an error when entity is invalid', async () => {
		const model = RoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
		try {
			RoleModelMapper.toEntity(model);
			fail('The role is valid but an error was expected');
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
			.spyOn(Role, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = RoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => RoleModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a role model to a role entity', async () => {
		const created_at = new Date();
		const model = RoleModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'Role 1',
			description: 'Description 1',
			is_active: true,
			created_at,
		});
        
		const entity = RoleModelMapper.toEntity(model);

		expect(entity.toJSON()).toStrictEqual(
			new Role(
				{
					name: 'Role 1',
					description: 'Description 1',
					is_active: true,
					created_at,
				},
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			).toJSON()
		);
	});
});
