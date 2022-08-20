import { RoleSequelize } from '#access/infra/db/sequelize/role-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateRoleUseCase } from '../../create-role.use-case';

const { RoleSequelizeRepository, RoleModel } = RoleSequelize;

describe('CreateRoleUseCase Integrations Tests', () => {
	let useCase: CreateRoleUseCase.UseCase;
	let repository: RoleSequelize.RoleSequelizeRepository;

	setupSequelize({ models: [RoleModel] });

	beforeEach(() => {
		repository = new RoleSequelizeRepository(RoleModel);
		useCase = new CreateRoleUseCase.UseCase(repository);
	});

	it('should create a new role', async () => {
		let output = await useCase.execute({
			name: 'Test Role',
			description: 'Test Role Description',
		});
		let role = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: role.id,
			name: 'Test Role',
			description: 'Test Role Description',
			is_active: true,
			created_at: role.props.created_at,
		});

		output = await useCase.execute({
			name: 'Test Role',
			description: 'Test Role Description',
			is_active: false,
		});

		role = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: role.id,
			name: 'Test Role',
			description: 'Test Role Description',
			is_active: false,
			created_at: role.props.created_at,
		});
	});

	describe('test with test.each', () => {
		const arrange = [
			{
				inputProps: { name: 'Test Role', description: 'Test Role Description' },
				outputProps: {
					name: 'Test Role',
					description: 'Test Role Description',
					is_active: true,
				},
			},
		];
		test.each(arrange)(
			'input $inputProps, output $outputProps',
			async ({ inputProps, outputProps }) => {
				let output = await useCase.execute(inputProps);
				let role = await repository.findById(output.id);
				expect(output.id).toBe(role.id);
				expect(output.created_at).toStrictEqual(
					role.props.created_at
				);
				expect(output).toMatchObject(outputProps);
			}
		);
	});
});
