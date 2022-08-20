import { UpdateGroupUseCase } from '../../update-group.use-case';
import NotFoundError from '#seedwork/domain/errors/not-found.error';
import { setupSequelize } from '#seedwork/infra';
import { GroupSequelize } from '#access/infra/db/sequelize/group-sequelize';
import _chance from 'chance';

const chance = _chance();

const { GroupSequelizeRepository, GroupModel } = GroupSequelize;

describe('UpdateGroupUseCase Integration Tests', () => {
	let useCase: UpdateGroupUseCase.UseCase;
	let repository: GroupSequelize.GroupSequelizeRepository;

	setupSequelize({ models: [GroupModel] });

	beforeEach(() => {
		repository = new GroupSequelizeRepository(GroupModel);
		useCase = new UpdateGroupUseCase.UseCase(repository);
	});

	it('should throw an error when id is not found', async () => {
		await expect(
			useCase.execute({ id: 'fake-id', name: 'fake-name', description: 'fake-description' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID fake-id')
		);
	});

	it('should update group', async () => {
		type Arrange = {
			input: {
				id: string;
				name: string;
				description: string | null;
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

		const model = await GroupModel.factory().create();

		let output = await useCase.execute({
			id: model.id,
			name: 'Test',
			description: 'some description',
		});

		expect(output).toStrictEqual({
			id: model.id,
			name: 'Test',
			description: 'some description',
			is_active: true,
			created_at: model.created_at,
		});

		const arrange: Arrange[] = [
			{
				input: {
					id: model.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
                    description: 'some description 2',
					is_active: false,
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description 2',
					is_active: false,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
                    description: 'some description',
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
                    description: 'some description 3',
					is_active: true,
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description 3',
					is_active: true,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
                    description: 'some description 4',
				},
				expected: {
					id: model.id,
					name: 'Test',
                    description: 'some description 4',					
					is_active: true,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
					description: 'some description',
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description',
					is_active: true,
					created_at: model.created_at,
				},
			},
			{
				input: {
					id: model.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
				},
				expected: {
					id: model.id,
					name: 'Test',
					description: 'some description',
					is_active: false,
					created_at: model.created_at,
				},
			},
		];

		for (const i of arrange) {
			output = await useCase.execute({
				id: i.input.id,
				name: i.input.name,
				description: i.input.description,
				is_active: i.input.is_active,
			});
			expect(output).toStrictEqual({
				id: model.id,
				name: i.expected.name,
				description: i.expected.description,
				is_active: i.expected.is_active,
				created_at: i.expected.created_at,
			});
		}
	});
});
