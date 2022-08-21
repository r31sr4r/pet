import { User } from '../../../../domain/entities/user';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import {GetUserUseCase} from '../../get-user.use-case';

describe('GetUserUseCase Unit Tests', () => {
	let useCase: GetUserUseCase.UseCase;
	let repository: UserInMemoryRepository;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		useCase = new GetUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a user', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new User({
				name: 'Tony Stark',
                email: 'toto@mail.com',
				password: 'Password1',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Tony Stark',
			email: 'toto@mail.com',			
			password: repository.items[0].password,
			is_active: true,			
			created_at: repository.items[0].created_at,
		});
	});


});
