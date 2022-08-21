import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateUserUseCase } from '../../create-user.use-case';
import { ValidationError } from '#seedwork/domain';

const { UserSequelizeRepository, UserModel } = UserSequelize;

describe('CreateUserUseCase Integrations Tests', () => {
	let useCase: CreateUserUseCase.UseCase;
	let repository: UserSequelize.UserSequelizeRepository;

	setupSequelize({ models: [UserModel] });

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		useCase = new CreateUserUseCase.UseCase(repository);
	});

	it('should create a new user', async () => {
		let output = await useCase.execute({
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: 'Somepass1',
		});
		let user = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: user.id,
			name: 'Marky Ramone',
			email: 'marky.ramone@mail.com',
			password: user.props.password,
			is_active: true,
			created_at: user.props.created_at,
		});

		output = await useCase.execute({
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: 'Somepass2',
			is_active: false,
		});

		user = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: user.id,
			name: 'Marc Steven Bell',
			email: 'bell@mail.com',
			password: user.props.password,
			is_active: false,
			created_at: user.props.created_at,
		});
	});

	describe('test with test.each', () => {
		const arrange = [
			{
				inputProps: { name: 'Test User', 
				email: 'somemail@mail.com',
				password: 'Somepass1' },				
				outputProps: {
					name: 'Test User',
					email: 'somemail@mail.com',
					is_active: true,
				},
			},
		];
		test.each(arrange)(
			'input $inputProps, output $outputProps',
			async ({ inputProps, outputProps }) => {
				let output = await useCase.execute(inputProps);
				let user = await repository.findById(output.id);
				expect(output.id).toBe(user.id);
				expect(output.created_at).toStrictEqual(
					user.props.created_at
				);
				expect(output).toMatchObject(outputProps);
			}
		);
	});

	it('should throw an error if email is already registered', async () => {
		await useCase.execute({
			name: 'Marky Ramone',
			email: 'mark.ramone@mail.com',
			password: 'Somepass1',
		});
		await expect(
			useCase.execute({
				name: 'Marky not Ramone',
				email: 'mark.ramone@mail.com',
				password: 'Somepass2',
			}),
		).rejects.toThrowError(
			new ValidationError(`Entity already exists using email mark.ramone@mail.com`)
		);
	});
});
