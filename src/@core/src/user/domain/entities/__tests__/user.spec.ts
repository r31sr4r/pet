import { User, UserProperties } from '../user';
import { omit } from 'lodash';
import { UniqueEntityId, ValidationError } from '#seedwork/domain';

describe('User Unit Tests', () => {
	beforeEach(() => {
		User.validate = jest.fn();
	});

	test('constructor of User', () => {
		let user = new User({
			name: 'Tom Brady',
			email: 'somemail@some.com',
			password: 'Somepassword#',
		});
		let props = omit(user.props, ['created_at'], ['password']);

		expect(User.validate).toHaveBeenCalled();
		expect(props).toStrictEqual({
			name: 'Tom Brady',
			email: 'somemail@some.com',
			is_active: true,
		});

		user = new User({
			name: 'Tom Brady',
			email: 'somemail@some.com',
			password: 'Somepassword#',
			is_active: false,
		});
		props = omit(user.props, ['created_at'], ['password']);

		expect(props).toStrictEqual({
			name: 'Tom Brady',
			email: 'somemail@some.com',
			is_active: false,
		});

		let created_at = new Date();
	
		user = new User({
			name: 'Vito Corleone',
			email: 'somemail@some.com',
			password: 'Somepassword#',
			is_active: false,
			created_at,
		});

		props = omit(user.props, ['password']);
		expect(props).toStrictEqual({
			name: 'Vito Corleone',
			email: 'somemail@some.com',
			is_active: false,
			created_at,
		});
	});

	test('id field', () => {
		type UserData = { props: UserProperties; id?: UniqueEntityId };
		const data: UserData[] = [
			{
				props: {
					name: 'Paul Mcartney',
					email: 'somemail@mail.com',
					password: 'Somepass1',
				},
				id: null,
			},
			{
				props: {
					name: 'Paul Mcartney',
					email: 'somemail@mail.com',
					password: 'Somepass1',
				},
				id: undefined,
			},
			{
				props: {
					name: 'Paul Mcartney',
					email: 'somemail@mail.com',
					password: 'Somepass1',
				},
				id: new UniqueEntityId(),
			},
		];

		data.forEach((item) => {
			const user = new User(item.props, item.id);
			expect(user.id).not.toBeNull();
		});
	});

	test('getter and setter of name prop', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@some.com',
			password: 'Somepass1',
		});
		expect(user.name).toBe('Paul Mcartney');

		user['name'] = 'John Lennon';
		expect(user.name).toBe('John Lennon');
	});

	test('getter and setter of email prop', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@some.com',
			password: 'Somepass1',
		});
		expect(user.email).toBe('somemail@some.com');

		user['email'] = 'othermail@some.com';
		expect(user.email).toBe('othermail@some.com');
	});

	test('getter and setter of password prop', async () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@some.com',
			password: 'Somepass1',
		});

		const oldPassword = user.password;

		user['password'] = 'Otherpass1';

		expect(user.password).not.toBe(oldPassword);
	});

	test('getter and setter of is_active prop', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
			is_active: true,
		});
		expect(user.is_active).toBe(true);

		user['is_active'] = false;
		expect(user.is_active).toBe(false);
	});

	test('getter and setter of created_at prop', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
		});

		expect(user.created_at).toBeInstanceOf(Date);

		user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
			created_at: new Date(),
		});
		expect(user.created_at).toBeInstanceOf(Date);
	});

	it('should deactivate a user', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
		});
		expect(user.is_active).toBe(true);
		user.deactivate();

		expect(user.is_active).toBe(false);
		expect(user).toMatchObject({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			is_active: false,
		});
	});

	it('should activate a user', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
			is_active: false,
		});
		expect(user.is_active).toBe(false);

		user.activate();

		expect(user.is_active).toBe(true);
		expect(user).toMatchObject({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			is_active: true,
		});
	});

	it('should update a user', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
		});
		expect(user.is_active).toBe(true);

		user.update('Paul McCartney', 'othermail@mail.com');

		expect(User.validate).toHaveBeenCalledTimes(2);

		expect(user).toMatchObject({
			name: 'Paul McCartney',
			email: 'othermail@mail.com',
		});

		user.update('John Lennon', 'john@mail.com');
		expect(user).toMatchObject({
			name: 'John Lennon',
			email: 'john@mail.com',
		});
	});

	it('should throw a ValidationError on trying to update password with invalid current password', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
		});
		expect(user.is_active).toBe(true);

		expect(() => {
			user.updatePassword('SomeInvalidCurrent', 'Otherpass1');
		}).toThrow(ValidationError);
	});

	it('should update a user with a new password', () => {
		let user = new User({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: 'Somepass1',
		});

		const oldPassword = user.password;
		user.updatePassword('Somepass1', 'Otherpass1');
		expect(user.password).not.toBe(oldPassword);
		

		expect(user).toMatchObject({
			name: 'Paul Mcartney',
			email: 'somemail@mail.com',
			password: user.password,
		});
	});
});
