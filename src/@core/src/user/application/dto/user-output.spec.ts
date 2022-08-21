import { omit } from 'lodash';
import { User } from '../../domain/entities/user';
import { UserOutputMapper } from './user-output';

describe('UserOutput Unit Tests', () => {
	describe('UserOutputMapper Unit Tests', () => {
		it('should convert a user to output', () => {
			const created_at = new Date();
			const user = new User({
				name: 'User 1',
				email: 'somemail@mail.com',
				password: 'Somepass1',
				is_active: true,
				created_at,
			});

			const spyToJSON = jest.spyOn(user, 'toJSON');
			const output = UserOutputMapper.toOutput(user);

			let props = omit(output, ['password']);

			expect(spyToJSON).toHaveBeenCalled();
			expect(props).toStrictEqual({
				id: user.id,
				name: 'User 1',
				email: 'somemail@mail.com',
				is_active: true,
				created_at,
			});
		});
	});
});
