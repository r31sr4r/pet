import { ListUserAssignedToGroupRoleUseCase } from '../../list-user-assigned-to-group-and-role.use-case';
import UserAssignedToGroupAndRoleInMemoryRepository from '../../../../../infra/db/in-memory/user-assigned-to-group-and-role-in-memory.repository';
import { UserAssignedToGroupAndRoleRepository } from '../../../../../domain/repository/user-assigned-to-group-and-role.repository';
import { UserAssignedToGroupAndRole } from '../../../../../domain/entities/user-assigned-to-group-and-role';

let repository: UserAssignedToGroupAndRoleInMemoryRepository;
let useCase: ListUserAssignedToGroupRoleUseCase.UseCase;

beforeEach(() => {
	repository = new UserAssignedToGroupAndRoleInMemoryRepository();
	useCase = new ListUserAssignedToGroupRoleUseCase.UseCase(repository);
});

describe('ListUserAssignedToGroupAndRoleUseCase Unit Tests', () => {
	test('toOutput method', () => {
		let result = new UserAssignedToGroupAndRoleRepository.SearchResult({
			items: [],
			total: 1,
			current_page: 1,
			per_page: 2,
			sort: null,
			sort_dir: null,
			filter: null,
		});

		let output = useCase['toOutput'](result);
		expect(output).toStrictEqual({
			items: [],
			total: 1,
			current_page: 1,
			last_page: 1,
			per_page: 2,
		});

		const entity = new UserAssignedToGroupAndRole({
			user_id: 'b3150e2c-c18b-47b0-b276-a9fdb37f4587',
			group_id: '666f62ad-cb11-4963-a240-d4e60e625acd',
			role_id: '19ed709e-b667-468b-b5c5-0385783d0271',
		});
		result = new UserAssignedToGroupAndRoleRepository.SearchResult({
			items: [entity],
			total: 1,
			current_page: 1,
			per_page: 2,
			sort: null,
			sort_dir: null,
			filter: null,
		});

		output = useCase['toOutput'](result);
		expect(output).toStrictEqual({
			items: [entity.toJSON()],
			total: 1,
			current_page: 1,
			last_page: 1,
			per_page: 2,
		});
	});

	it('should return output with two roles ordered by created_at when input is empty', async () => {
		const created_at = new Date();
		const entity1 = new UserAssignedToGroupAndRole({
			user_id: 'b3150e2c-c18b-47b0-b276-a9fdb37f4587',
			group_id: '666f62ad-cb11-4963-a240-d4e60e625acd',
			role_id: '19ed709e-b667-468b-b5c5-0385783d0271',
			created_at,
		});
		const entity2 = new UserAssignedToGroupAndRole({
			user_id: '7a67dd3f-1457-41ff-af7a-456dbeebeda5',
			group_id: '666f62ad-cb11-4963-a240-d4e60e625acd',
			role_id: '19ed709e-b667-468b-b5c5-0385783d0271',
			created_at: new Date(created_at.getTime() + 100),
		});

		repository.items = [entity1, entity2];

		const output = await useCase.execute({});

		expect(output).toStrictEqual({
			items: [entity2.toJSON(), entity1.toJSON()],
			total: 2,
			current_page: 1,
			last_page: 1,
			per_page: 15,
		});
	});


});
