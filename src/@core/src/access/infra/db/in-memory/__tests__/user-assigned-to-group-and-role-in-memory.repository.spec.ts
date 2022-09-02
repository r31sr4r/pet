import { UserAssignedToGroupAndRole } from '#access/domain/entities/user-assigned-to-group-and-role';
import UserAssignedToGroupAndRoleInMemoryRepository from '../user-assigned-to-group-and-role-in-memory.repository';

describe('UserAssignedToGroupAndRoleInMemoryRepository Unit Tests', () => {
	let repository: UserAssignedToGroupAndRoleInMemoryRepository;
	beforeEach(() => {
		repository = new UserAssignedToGroupAndRoleInMemoryRepository();
	});

	it('should return items without filter', async () => {
		const items = [
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '97ff1a57-0874-4643-ae50-9dc4a074315f',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',				
			}),
			new UserAssignedToGroupAndRole({
				user_id: '80c7b707-54d5-4b58-bbe1-6e76a2f8287d',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);

		const filterdItems = await repository['applyFilter'](items, null);
		expect(filterdItems).toStrictEqual(items);
		expect(spyFilterMethod).not.toHaveBeenCalled();
	});

	it('should return filtered items when filter is not null', async () => {
		const items = [
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '97ff1a57-0874-4643-ae50-9dc4a074315f',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',	
			}),
			new UserAssignedToGroupAndRole({
				user_id: '80c7b707-54d5-4b58-bbe1-6e76a2f8287d',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: '80c7b707-54d5-4b58-bbe1-6e76a2f8287d',
                group_id: '97ff1a57-0874-4643-ae50-9dc4a074315f',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: '09b3ee48-f7ae-4292-bd80-1ae79951d3eb',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: 'bd400b87-d957-42ab-931d-c8f2379c92c7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
		];

		const spyFilterMethod = jest.spyOn(items, 'filter' as any);
		let filterdItems = await repository['applyFilter'](
			items,
			'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7'
		);

		expect(filterdItems).toStrictEqual([items[0], items[3]]);
		expect(spyFilterMethod).toHaveBeenCalledTimes(1);

		filterdItems = await repository['applyFilter'](items, '09b3ee48-f7ae-4292-bd80-1ae79951d3eb');
		expect(filterdItems).toStrictEqual([items[4]]);
		expect(spyFilterMethod).toHaveBeenCalledTimes(2);

		filterdItems = await repository['applyFilter'](items, 'no-filter');
		expect(filterdItems).toHaveLength(0);
		expect(spyFilterMethod).toHaveBeenCalledTimes(3);
	});

	it('should return all roles with created_at sort when sort is null', async () => {
		const created_at = new Date();
		const created_at2 = new Date('2020-01-01');
		const created_at3 = new Date('2021-04-02');

		const items = [
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '97ff1a57-0874-4643-ae50-9dc4a074315f',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',	
				created_at: created_at,
			}),
			new UserAssignedToGroupAndRole({
				user_id: 'bd400b87-d957-42ab-931d-c8f2379c92c7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
				created_at: created_at2,
			}),
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
				created_at: created_at3,
			}),
		];

		let sortedItems = await repository['applySort'](items, null, null);
		expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
	});

	it('should return sorted roles when sort is not null', async () => {
		const items = [
			new UserAssignedToGroupAndRole({
				user_id: 'bd400b87-d957-42ab-931d-c8f2379c92c7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: '09b3ee48-f7ae-4292-bd80-1ae79951d3eb',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: 'ab4f9603-f3d6-4dcc-aab3-e3ac199bd4a7',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
			new UserAssignedToGroupAndRole({
				user_id: '80c7b707-54d5-4b58-bbe1-6e76a2f8287d',
                group_id: '136cf239-bdef-4b7a-ac95-8284be6fa8d9',
                role_id: 'b3f214ad-f7e0-4abb-8c88-9d8207429848',
			}),
		];

		let sortedItems = await repository['applySort'](items, 'user_id', 'asc');

		expect(sortedItems).toStrictEqual([
			items[1],
			items[3],
			items[2],
			items[0],			
		]);

		sortedItems = await repository['applySort'](items, 'user_id', 'desc');
		expect(sortedItems).toStrictEqual([
			items[0],
			items[2],
			items[3],
			items[1],			
		]);
	});
});
