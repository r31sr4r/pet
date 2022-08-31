import UserAssignedToGroupAndRoleValidatorFactory, {
	UserAssignedToGroupAndRoleRules,
	UserAssignedToGroupAndRoleValidator,
} from '../user-assigned-to-group-and-role.validator';

describe('UserAssignedToGroupAndRole Validator Unit Tests', () => {
	let validator: UserAssignedToGroupAndRoleValidator;

	beforeEach(
		() => (validator = UserAssignedToGroupAndRoleValidatorFactory.create())
	);

	test('invalidation cases for user_id field', () => {
		expect({ validator, data: null }).containsErrorMessages({
			user_id: ['user_id should not be empty', 'user_id must be a UUID'],
		});

		expect({
			validator,
			data: { user_id: '' },
		}).containsErrorMessages({
			user_id: ['user_id should not be empty', 'user_id must be a UUID'],
		});

		expect({
			validator,
			data: { user_id: 'ab' },
		}).containsErrorMessages({
			user_id: ['user_id must be a UUID'],
		});
		expect({
			validator,
			data: { user_id: 'a'.repeat(256) },
		}).containsErrorMessages({
			user_id: ['user_id must be a UUID'],
		});
	});

	test('invalidation cases for group_id field', () => {
		expect({
			validator,
			data: {
				user_id: 'Some b0ad42b5-6fa0-44a8-b174-83d014a35227',
				group_id: '',
			},
		}).containsErrorMessages({
			group_id: [
				'group_id should not be empty',
				'group_id must be a UUID',
			],
		});
	});

	test('invalidation cases for role_id field', () => {
		expect({
			validator,
			data: {
				user_id: 'a4b22993-d8bd-4d22-8280-3a8ff0049985',
				group_id: 'e78d7abe-3043-4bda-a042-f967b9c74483',
				role_id: null,
			},
		}).containsErrorMessages({
			role_id: [
				'role_id should not be empty',
				'role_id must be a UUID',
			],
		});
	});

	describe('valid cases for all fields', () => {
		const arrange = [
			{
				user_id: '225c7f6c-6c7c-4c73-b4db-c93f8a3d3ff8',
				group_id: 'e78d7abe-3043-4bda-a042-f967b9c74483',
                role_id: '99f14001-2303-4fa9-923b-75e972b933c1',
			},
			{
				user_id: '512710e7-8f2a-4275-b1dd-66c05918420c',
				group_id: 'e6528fcd-a4c9-4fbf-a40d-0315f594b408',
				role_id: 'be19223a-598d-489d-8753-7aceb7b3c1b2',
				created_at: new Date(),
			},
		];

		test.each(arrange)('validates %p', (item) => {
			const isValid = validator.validate(item);
			expect(isValid).toBe(true);
			expect(validator.errors).toBeNull();
			expect(validator.validatedData).toStrictEqual(
				new UserAssignedToGroupAndRoleRules(item)
			);
		});
	});
});
