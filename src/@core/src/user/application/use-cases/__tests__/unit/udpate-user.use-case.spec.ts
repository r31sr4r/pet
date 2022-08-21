import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import { UpdateUserUseCase } from '../../update-user.use-case';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { User } from '../../../../domain/entities/user';

describe('UpdateUserUseCase Unit Tests', () => {
	let useCase: UpdateUserUseCase.UseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		useCase = new UpdateUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(
			useCase.execute({
				id: 'fake id',
				name: 'some name',
				email: 'somemail@mail.com',
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
				is_active: boolean;
				created_at?: Date;
			};
		};

		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new User({
			name: 'Tony Start',
			email: 'tony@mail.com',
			password: 'Some123456',
		});
		repository.items = [entity];

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

		let output = await useCase.execute({
			id: entity.id,
			name: 'Tony Stark',
			email: 'ton@mail.com',
		});
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Tony Stark',
			email: 'ton@mail.com',
			password: entity.password,
			is_active: true,
			created_at: entity.created_at,
		});
		expect(spyUpdate).toHaveBeenCalledTimes(1);

		for (const item of arrange) {
			output = await useCase.execute({
				id: item.input.id,
				name: item.input.name,
				email: item.input.email,
				is_active: item.input.is_active,
			});
			expect(output).toMatchObject({
				id: entity.id,
				name: item.expected.name,
				email: item.expected.email,
				is_active: item.expected.is_active,
				created_at: item.expected.created_at,
			});
		}
	});
});
