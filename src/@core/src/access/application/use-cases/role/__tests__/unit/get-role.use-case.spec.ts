import { Role } from '../../../../../domain/entities/role';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import RoleInMemoryRepository from '../../../../../infra/db/in-memory/role-in-memory.repository';
import { GetRoleUseCase } from '../../get-role.use-case';

let repository: RoleInMemoryRepository;
let useCase: GetRoleUseCase.UseCase;

beforeEach(() => {
	repository = new RoleInMemoryRepository();
	useCase = new GetRoleUseCase.UseCase(repository);
});

describe('GetRoleUseCase Unit Tests', () => {
	it('should throw an error when role not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a role', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new Role({
				name: 'Test Role',
                description: 'Test Role Description',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test Role',
			description: 'Test Role Description',
			is_active: true,
			created_at: repository.items[0].created_at,
		});
	});
});
