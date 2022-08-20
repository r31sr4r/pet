import GroupInMemoryRepository from '#access/infra/db/in-memory/group-in-memory.repository';
import { CreateGroupUseCase } from '../../create-group.use-case';

describe('CreateGroupUseCase Unit Tests', () => {
	let useCase: CreateGroupUseCase.UseCase;
	let repository: GroupInMemoryRepository;

	beforeEach(() => {
		repository = new GroupInMemoryRepository();
		useCase = new CreateGroupUseCase.UseCase(repository);
	});

	it('should create a new group', async () => {
		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			name: 'Test Group',
			description: 'Test Group Description',
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			name: 'Test Group',
			description: 'Test Group Description',
			is_active: true,
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			name: 'Vet',
			description: 'Vet Group Description',
			is_active: false,
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			id: repository.items[1].id,
			name: 'Vet',
			description: 'Vet Group Description',
			is_active: false,
			created_at: repository.items[1].created_at,
		});
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity validation error'
		);
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be a string',
					'name must be longer than or equal to 3 characters',
					'name must be shorter than or equal to 255 characters',
				],
			},
		});

		await expect(
			useCase.execute({ name: '' } as any)
		).rejects.toMatchObject({
			error: {
				name: [
					'name should not be empty',
					'name must be longer than or equal to 3 characters',
				],
			},
		});
	});

	it('should throw an error if description is not provided', async () => {
		await expect(
			useCase.execute({ name: 'Test Group' } as any)
		).rejects.toThrow('Entity validation error');

		await expect(
			useCase.execute({ name: 'Test Group', description: '' } as any)
		).rejects.toMatchObject({
			error: {
				description: ['description should not be empty']
			},
		});
	});
});
