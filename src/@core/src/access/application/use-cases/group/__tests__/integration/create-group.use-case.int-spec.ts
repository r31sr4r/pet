import { GroupSequelize } from '#access/infra/db/sequelize/group-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateGroupUseCase } from '../../create-group.use-case';

const { GroupSequelizeRepository, GroupModel } = GroupSequelize;

describe('CreateGroupUseCase Integrations Tests', () => {
	let useCase: CreateGroupUseCase.UseCase;
	let repository: GroupSequelize.GroupSequelizeRepository;

	setupSequelize({ models: [GroupModel] });

	beforeEach(() => {
		repository = new GroupSequelizeRepository(GroupModel);
		useCase = new CreateGroupUseCase.UseCase(repository);
	});

	it('should create a new group', async () => {
		let output = await useCase.execute({
			name: 'Test Group',
			description: 'Test Group Description',
		});
		let group = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: group.id,
			name: 'Test Group',
			description: 'Test Group Description',
			is_active: true,
			created_at: group.props.created_at,
		});

		output = await useCase.execute({
			name: 'Test Group',
			description: 'Test Group Description',
			is_active: false,
		});

		group = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: group.id,
			name: 'Test Group',
			description: 'Test Group Description',
			is_active: false,
			created_at: group.props.created_at,
		});
	});

	describe('test with test.each', () => {
		const arrange = [
			{
				inputProps: { name: 'Test Group', description: 'Test Group Description' },
				outputProps: {
					name: 'Test Group',
					description: 'Test Group Description',
					is_active: true,
				},
			},
		];
		test.each(arrange)(
			'input $inputProps, output $outputProps',
			async ({ inputProps, outputProps }) => {
				let output = await useCase.execute(inputProps);
				let group = await repository.findById(output.id);
				expect(output.id).toBe(group.id);
				expect(output.created_at).toStrictEqual(
					group.props.created_at
				);
				expect(output).toMatchObject(outputProps);
			}
		);
	});
});
