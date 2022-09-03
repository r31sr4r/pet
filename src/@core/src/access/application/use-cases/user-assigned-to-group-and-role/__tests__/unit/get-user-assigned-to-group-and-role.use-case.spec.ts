import { UserAssignedToGroupAndRole } from '../../../../../domain/entities/user-assigned-to-group-and-role';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import UserAssignedToGroupAndRoleInMemoryRepository from '../../../../../infra/db/in-memory/user-assigned-to-group-and-role-in-memory.repository';
import { GetUserAssignedToGroupAndRoleUseCase } from '../../get-user-assigned-to-group-and-role.use-case';

let repository: UserAssignedToGroupAndRoleInMemoryRepository;
let useCase: GetUserAssignedToGroupAndRoleUseCase.UseCase;

beforeEach(() => {
	repository = new UserAssignedToGroupAndRoleInMemoryRepository();
	useCase = new GetUserAssignedToGroupAndRoleUseCase.UseCase(repository);
});

describe('GetUserAssignedToGroupAndRoleUseCase Unit Tests', () => {
	it('should throw an error when role not found', async () => {
		await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake id')
		);
	});

	it('should return a UserAssignedToGroupAndRole', async () => {
		const spyFindById = jest.spyOn(repository, 'findById');
		let items = [
			new UserAssignedToGroupAndRole({
				user_id: 'c4b4ee79-e111-4141-a239-214f32dab517',
				group_id: 'b3ddb74c-474c-4d97-b082-8dc0330f0bb0',
				role_id: 'b3150e2c-c18b-47b0-b276-a9fdb37f4587',
			}),
		];
		repository.items = items;
		let output = await useCase.execute({ id: items[0].id });

		expect(spyFindById).toHaveBeenCalledTimes(1);
		expect(output).toStrictEqual({
			id: repository.items[0].id,
			user_id: 'c4b4ee79-e111-4141-a239-214f32dab517',
			group_id: 'b3ddb74c-474c-4d97-b082-8dc0330f0bb0',
			role_id: 'b3150e2c-c18b-47b0-b276-a9fdb37f4587',
			created_at: repository.items[0].created_at,
		});
	});
});
