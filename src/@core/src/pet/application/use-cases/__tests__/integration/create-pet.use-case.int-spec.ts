import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreatePetUseCase } from '../../create-pet.use-case';

const { PetSequelizeRepository, PetModel } = PetSequelize;

describe('CreatePetUseCase Integrations Tests', () => {
	let useCase: CreatePetUseCase.UseCase;
	let repository: PetSequelize.PetSequelizeRepository;

	setupSequelize({ models: [PetModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new CreatePetUseCase.UseCase(repository);
	});

	it('should create a new pet', async () => {
		let output = await useCase.execute({
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
		});
		let pet = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: pet.id,
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: pet.props.created_at,
		});

		output = await useCase.execute({
			name: 'Tom',
			type: 'Cat',
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
		});

		pet = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: pet.id,
			name: 'Tom',
			type: 'Cat',
			breed: null,
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
			created_at: pet.props.created_at,
		});
	});

	describe('test with test.each', () => {
		const arrange = [
			{
				inputProps: { name: 'Test Pet', type: 'Dog', breed: 'Test' },
				outputProps: {
					name: 'Test Pet',
					type: 'Dog',
					breed: 'Test',
					is_active: true,
				},
			},
		];
		test.each(arrange)(
			'input $inputProps, output $outputProps',
			async ({ inputProps, outputProps }) => {
				let output = await useCase.execute(inputProps);
				let pet = await repository.findById(output.id);
				expect(output.id).toBe(pet.id);
				expect(output.created_at).toStrictEqual(
					pet.props.created_at
				);
				expect(output).toMatchObject(outputProps);
			}
		);
	});
});
