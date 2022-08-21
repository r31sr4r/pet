import { User } from '../../../../domain/entities/user';
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import UserInMemoryRepository from '../../../../infra/db/in-memory/user-in-memory.repository';
import { DeleteUserUseCase } from '../../delete-user.use-case';

describe('DeleteUserUseCase Unit Tests', () => {
	let repository: UserInMemoryRepository;
	let useCase: DeleteUserUseCase.UseCase;

	beforeEach(() => {
		repository = new UserInMemoryRepository();
		useCase = new DeleteUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should delete a user', async () => {
		const spyDelete = jest.spyOn(repository, 'delete');
		let items = [
			new User({
				name: 'Test User',
				email: 'testmail@mail.com',
                password: 'Testpasswor123',
			}),
		];
		repository.items = items;
		await useCase.execute({ id: items[0].id });
		expect(spyDelete).toHaveBeenCalledTimes(1);
		expect(repository.items.length).toBe(0);
	});
});
