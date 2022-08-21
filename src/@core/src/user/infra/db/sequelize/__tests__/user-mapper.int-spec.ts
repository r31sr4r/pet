import { User } from '#user/domain';
import { LoadEntityError, UniqueEntityId } from '#seedwork/domain';
import { setupSequelize } from '#seedwork/infra/testing/helpers/db';
import { UserSequelize } from '../user-sequelize';
import { omit } from 'lodash';

const { UserModel, UserModelMapper } = UserSequelize;

describe('UserMapper Integration Tests', () => {
	setupSequelize({ models: [UserModel] });

	it('should throw an error when entity is invalid', async () => {
		const model = UserModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});
		try {
			UserModelMapper.toEntity(model);
			fail('The user is valid but an error was expected');
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
			.spyOn(User, 'validate')
			.mockImplementation(() => {
				throw error;
			});
		const model = UserModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
		});

		expect(() => UserModelMapper.toEntity(model)).toThrow(error);
		expect(spyValidate).toHaveBeenCalled();
		spyValidate.mockRestore();
	});

	it('should map a user model to a user', async () => {
		const created_at = new Date();
		const model = UserModel.build({
			id: '02b090cf-5658-4073-b242-9bf64915b3ad',
			name: 'User 1',
			email: 'user1@mail.com',
			password: 'Some password1',
			is_active: true,
			created_at,
		});

		const entity = UserModelMapper.toEntity(model);

		expect(entity).toBeInstanceOf(User);

		const user = new User(
			{
				name: 'User 1',
				email: 'user1@mail.com',
				password: 'Some password1',
				is_active: true,
				created_at,
			},
			new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
		);

		let props = omit(user.props, ['password']);

		expect(entity.toJSON()).toMatchObject(props);
	});
});
