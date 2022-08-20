import { Group } from '../../../../../domain/entities/group';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import GroupInMemoryRepository from '../../../../../infra/db/in-memory/group-in-memory.repository';
import { GetGroupUseCase } from '../../get-group.use-case';

let repository: GroupInMemoryRepository;
let useCase: GetGroupUseCase.UseCase;

beforeEach(() => {
	repository = new GroupInMemoryRepository();
	useCase = new GetGroupUseCase.UseCase(repository);
});

describe('GetGroupUseCase Unit Tests', () => {
	it('should throw an error when group not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a group', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new Group({
				name: 'Test Group',
                description: 'Test Group Description',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test Group',
			description: 'Test Group Description',
			is_active: true,
			created_at: repository.items[0].created_at,
		});
	});
});
