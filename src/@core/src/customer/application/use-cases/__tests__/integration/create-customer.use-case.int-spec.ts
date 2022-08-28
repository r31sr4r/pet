import { CustomerSequelize } from '#customer/infra/db/sequelize/customer-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { CreateCustomerUseCase } from '../../create-customer.use-case';

const { CustomerSequelizeRepository, CustomerModel } = CustomerSequelize;

describe('CreateCustomerUseCase Integrations Tests', () => {
	let useCase: CreateCustomerUseCase.UseCase;
	let repository: CustomerSequelize.CustomerSequelizeRepository;

	setupSequelize({ models: [CustomerModel] });

	beforeEach(() => {
		repository = new CustomerSequelizeRepository(CustomerModel);
		useCase = new CreateCustomerUseCase.UseCase(repository);
	});

	it('should create a new customer', async () => {
		let output = await useCase.execute({
			name: 'John Doe',
			email: 'somemail@mail.com',
			cellphone: '+55 (11) 99999-9999',
		});
		let customer = await repository.findById(output.id);

		expect(output).toStrictEqual({
			id: customer.id,
			name: 'John Doe',
			email: 'somemail@mail.com',
			cellphone: '+55 (11) 99999-9999',
			cpf: null,
			gender: null,
			is_active: true,
			birth_date: null,
			created_at: customer.props.created_at,
			updated_at: null,
		});

		// output = await useCase.execute({
		// 	name: 'Tom',
		// 	type: 'Cat',
		// 	gender: 'Male',
		// 	is_active: false,
		// 	birth_date: new Date('2021-04-06'),
		// });

		// customer = await repository.findById(output.id);

		// expect(output).toStrictEqual({
		// 	id: customer.id,
		// 	name: 'Tom',
		// 	type: 'Cat',
		// 	breed: null,
		// 	gender: 'Male',
		// 	is_active: false,
		// 	birth_date: new Date('2021-04-06'),
		// 	created_at: customer.props.created_at,
		// });
	});

	// describe('test with test.each', () => {
	// 	const arrange = [
	// 		{
	// 			inputProps: {
	// 				name: 'John Doe',
	// 				email: 'somemail@mail.com',
	// 				cellphone: '+55 (11) 99999-9999',
	// 				cpf: '12345678901',
	// 			},
	// 			outputProps: {
	// 				name: 'John Doe',
	// 				email: 'somemail@mail.com',
	// 				cellphone: '+55 (11) 99999-9999',
	// 				cpf: '12345678901',
	// 				is_active: true,
	// 			},
	// 		},
	// 	];
	// 	test.each(arrange)(
	// 		'input $inputProps, output $outputProps',
	// 		async ({ inputProps, outputProps }) => {
	// 			let output = await useCase.execute(inputProps);
	// 			let customer = await repository.findById(output.id);
	// 			expect(output.id).toBe(customer.id);
	// 			expect(output.created_at).toStrictEqual(
	// 				customer.props.created_at
	// 			);
	// 			expect(output).toMatchObject(outputProps);
	// 		}
	// 	);
	// });
});
