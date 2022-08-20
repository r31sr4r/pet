import {UpdateRoleUseCase} from '../../update-role.use-case';
import RoleInMemoryRepository from '../../../../../infra/db/in-memory/role-in-memory.repository';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import {Role} from '../../../../../domain/entities/role';

describe('UpdateRoleUseCase Unit Tests', () => {
	let useCase: UpdateRoleUseCase.UseCase;
	let repository: RoleInMemoryRepository;

	beforeEach(() => {
		repository = new RoleInMemoryRepository();
		useCase = new UpdateRoleUseCase.UseCase(repository);
	});
	it('should throw an error when id is not found', async () => {
		await expect(
			useCase.execute({ id: 'fake-id', name: 'fake-name' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake-id')
		);
	});

	it('should update role', async () => {
		type Arrange = {	
			input: {
				id: string;
				name: string;
				description: string;
				is_active?: boolean | null;
			};
			expected: {
				id: string;
				name: string;
				description: string;
				is_active: boolean;
				created_at: Date;
			};
		};
		const spyUpdate = jest.spyOn(repository, 'update');
		const entity = new Role({ name: 'Vet', description: 'Vet Description' });
		repository.items = [entity];

		const arrange: Arrange[] = [
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
                    description: 'some description 2',
					is_active: false,
				},
				expected: {
					id: entity.id,
					name: 'Test',
                    description: 'some description 2',
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
                    description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
                    description: 'some description',
					is_active: false,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
                    description: 'some description',
					is_active: true,
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
                    description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: entity.created_at,
				},
			},
			{
				input: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
				},
				expected: {
					id: entity.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
					created_at: entity.created_at,
				},
			},
		];

		let output = await useCase.execute({ id: entity.id, name: 'Test', description: 'some description' });
		expect(output).toStrictEqual({
			id: entity.id,
			name: 'Test',
			description: 'some description',
			is_active: true,
			created_at: entity.created_at,
		});
		expect(spyUpdate).toHaveBeenCalledTimes(1);

		for (const i of arrange) {
			output = await useCase.execute({
				id: i.input.id,
				name: i.input.name,
				description: i.input.description,
				is_active: i.input.is_active,
			});
			expect(output).toStrictEqual({
				id: entity.id,
				name: i.expected.name,
				description: i.expected.description,
				is_active: i.expected.is_active,
				created_at: i.expected.created_at,
			});
		}
	});
});
