import { CustomerSequelize } from '#customer/infra';
import { PetSequelize } from '#pet/infra/db/sequelize/pet-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreatePetUseCase } from '../../create-pet.use-case';

const { PetSequelizeRepository, PetModel } = PetSequelize;

describe('CreatePetUseCase Integrations Tests', () => {
	let useCase: CreatePetUseCase.UseCase;
	let repository: PetSequelize.PetSequelizeRepository;

	setupSequelize({ models: [PetModel, CustomerSequelize.CustomerModel] });

	beforeEach(() => {
		repository = new PetSequelizeRepository(PetModel);
		useCase = new CreatePetUseCase.UseCase(repository);
	});

	it('should create a new pet', async () => {
		const customer =
			await CustomerSequelize.CustomerModel.factory().create();
		let output = await useCase.execute({
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
			customer_id: customer.id,
		});
		let pet = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: pet.id,
			name: 'Test',
			type: 'Dog',
			breed: 'Test',
			gender: null,
			is_active: true,
			customer_id: pet.props.customer_id,
			birth_date: null,
			created_at: pet.props.created_at,
		});

		output = await useCase.execute({
			name: 'Tom',
			type: 'Cat',
			gender: 'Male',
			is_active: false,
			birth_date: new Date('2021-04-06'),
			customer_id: customer.id,
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
			customer_id: pet.props.customer_id,
			created_at: pet.props.created_at,
		});
	});

	it('test with forEach', async () => {
		const customer =
			await CustomerSequelize.CustomerModel.factory().create();
		const arrange = [
			{
				inputProps: {
					name: 'Test Pet',
					type: 'Dog',
					breed: 'Test',
					customer_id: customer.id,
				},
				outputProps: {
					name: 'Test Pet',
					type: 'Dog',
					breed: 'Test',
					is_active: true,
					customer_id: customer.id,
				},
			},
		];

		arrange.forEach(async ({ inputProps, outputProps }) => {
			let output = await useCase.execute(inputProps);
			expect(output).toMatchObject(outputProps);
		});

	});
});
