import { UpdateUserUseCase } from '../../update-user.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { User } from '../../../../domain/entities/user';
import { setupSequelize } from '#seedwork/infra';
import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import _chance from 'chance';
import CreateUserUseCase from '../../create-user.use-case';
import { ValidationError } from '#seedwork/domain/errors';

const chance = _chance();

const { UserSequelizeRepository, UserModel } = UserSequelize;

describe('UpdateUserUseCase Integration Tests', () => {
	let useCase: UpdateUserUseCase.UseCase;
	let createUseCase: CreateUserUseCase.UseCase;
	let repository: UserSequelize.UserSequelizeRepository;

	setupSequelize({ models: [UserModel] });

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		useCase = new UpdateUserUseCase.UseCase(repository);
		createUseCase = new CreateUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(
			useCase.execute({
				id: 'fake id',
				name: 'some name',
				email: 'some email',
			})
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should update a user', async () => {
		type Arrange = {
			input: {
				id: string;
				name: string;
				email: string;
				password?: string | null;
				is_active?: boolean | null;
			};
			expected: {
				id: string;
				name: string;
				email: string;
				password?: string;
				is_active: boolean;
				created_at?: Date;
			};
		};

		const entity = await UserModel.factory().create();

		let output = await useCase.execute({
			id: entity.id,
			name: 'Tony Start',
			email: 'tony@mail.com',
			is_active: true,
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Tony Start',
			email: 'tony@mail.com',
			password: entity.password,
			is_active: output.is_active,
			created_at: entity.created_at,
		});

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Tony Stark',
					email: 'tony123@mail.com',
				},
				expected: {
					id: entity.id,
					name: 'Tony Stark',
					email: 'tony123@mail.com',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Steve Rogers',
					email: 'steve@mail.com',
				},
				expected: {
					id: entity.id,
					name: 'Steve Rogers',
					email: 'steve@mail.com',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Bruce Banner',
					email: 'banner_bruce@mail.com',
					is_active: false,
				},
				expected: {
					id: entity.id,
					name: 'Bruce Banner',
					email: 'banner_bruce@mail.com',
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Peter Parker',
					email: 'peter@mail.com',
				},
				expected: {
					id: entity.id,
					name: 'Peter Parker',
					email: 'peter@mail.com',
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Natasha Romanoff',
					email: 'nat@mail.com',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Natasha Romanoff',
					email: 'nat@mail.com',
					is_active: true,
					created_at: entity.created_at,
				},
			},
		];

		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				email: item.input.email,
				is_active: item.input.is_active,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: item.expected.name,
				email: item.expected.email,
				password: entity.password,
				is_active: item.expected.is_active,
				created_at: item.expected.created_at,
			});
		}
	});

	it('should update a user with a new password', async () => {
		const entity = await createUseCase.execute({
			name: 'Tony Stark',
			email: 'tony@mail.com',
			password: 'Pass123456',
		});

		console.log(entity);

		const output = await useCase.executeUpdatePassword({
			id: entity.id,
			name: 'Tony Stark',
			email: 'tony@mail.com',
			old_password: 'Pass123456',
			password: 'Tony123456',
		});

		console.log(output);
	});

	it('should throw an error when trying to update a user with a wrong password', async () => {
		const entity = await createUseCase.execute({
			name: 'Tony Stark',
			email: 'somemail@mail.com',
			password: 'Pass123456',
		});

		await expect(
			useCase.executeUpdatePassword({
				id: entity.id,
				name: 'Tony Stark',
				email: 'somemail@mail.com',
				old_password: 'Pass654321',
				password: 'Tony123456',
			})
		).rejects.toThrow(new ValidationError(`Current password is not valid`));
	});
});
