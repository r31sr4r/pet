import UserAssignedToGroupAndRoleInMemoryRepository from '#access/infra/db/in-memory/user-assigned-to-group-and-role-in-memory.repository';
import { CreateUserAssignedToGroupAndRoleUseCase } from '../../create-user-assigned-to-group-and-role.use-case';

describe('CreateUserAssignedToGroupAndRoleUseCase Unit Tests', () => {
	let useCase: CreateUserAssignedToGroupAndRoleUseCase.UseCase;
	let repository: UserAssignedToGroupAndRoleInMemoryRepository;

	beforeEach(() => {
		repository = new UserAssignedToGroupAndRoleInMemoryRepository();
		useCase = new CreateUserAssignedToGroupAndRoleUseCase.UseCase(
			repository
		);
	});

	it('should create a new UserAssignedToGroupAndRole', async () => {
		const spyInsert = jest.spyOn(repository, 'insert');
		let output = await useCase.execute({
			user_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
			group_id: 'da1f112e-c82a-492d-8e27-a33b54739717',
			role_id: 'de2ff617-3765-489d-9ee7-8dc29f1db061',
		});

		expect(spyInsert).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			user_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
			group_id: 'da1f112e-c82a-492d-8e27-a33b54739717',
			role_id: 'de2ff617-3765-489d-9ee7-8dc29f1db061',
			created_at: repository.items[0].created_at,
		});

		output = await useCase.execute({
			user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
			group_id: 'da1f112e-c82a-492d-8e27-a33b54739717',
			role_id: 'de2ff617-3765-489d-9ee7-8dc29f1db061',
		});

		expect(spyInsert).toHaveBeenCalledTimes(2);
		expect(output).toStrictEqual({
			id: repository.items[1].id,
			user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
			group_id: 'da1f112e-c82a-492d-8e27-a33b54739717',
			role_id: 'de2ff617-3765-489d-9ee7-8dc29f1db061',
			created_at: repository.items[1].created_at,
		});
	});

	it('should throw an error if name is not provided', async () => {
		await expect(useCase.execute(null as any)).rejects.toThrow(
			'Entity validation error'
		);
	});

	it('should throw an error if user_id is not provided', async () => {
		await expect(
			useCase.execute({ name: '' } as any)
		).rejects.toMatchObject({
			error: {
				user_id: [
					'user_id should not be empty',
					'user_id must be a UUID',
				],
			},
		});
	});

	it('should throw an error if group_id is not provided', async () => {
		await expect(
			useCase.execute({
				user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
			} as any)
		).rejects.toThrow('Entity validation error');

		await expect(
			useCase.execute({
				user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
				description: '',
			} as any)
		).rejects.toMatchObject({
			error: {
				group_id: [
					'group_id should not be empty',
					'group_id must be a UUID',
				],
			},
		});
	});

	it('should throw an error if role_id is not provided', async () => {
		await expect(
			useCase.execute({
				user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
				group_id: '95360cc2-102a-4414-8490-c552a02bab57',
			} as any)
		).rejects.toThrow('Entity validation error');

		await expect(
			useCase.execute({
				user_id: '24ff4946-dd53-44ca-8d6b-10e46754faf2',
				group_id: '95360cc2-102a-4414-8490-c552a02bab57',
				role_id: '',
			} as any)
		).rejects.toMatchObject({
			error: {
				role_id: [
					'role_id should not be empty',
					'role_id must be a UUID',
				],
			},
		});
	});
});
