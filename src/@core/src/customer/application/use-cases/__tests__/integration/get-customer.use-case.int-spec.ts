import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { GetCustomerUseCase } from '../../get-customer.use-case';
import { CustomerSequelize } from '#customer/infra/db/sequelize/customer-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { PetSequelize } from '#pet/infra';

const { CustomerSequelizeRepository, CustomerModel } = CustomerSequelize;
describe('DeleteCustomerUseCase Integragion Tests', () => {
	let repository: CustomerSequelize.CustomerSequelizeRepository;
	let useCase: GetCustomerUseCase.UseCase;

    setupSequelize({ models: [CustomerModel, PetSequelize.PetModel] });

	beforeEach(() => {
		repository = new CustomerSequelizeRepository(CustomerModel);
		useCase = new GetCustomerUseCase.UseCase(repository);
	});

	it('should throw an error when customer not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a customer', async () => {
		const model = await CustomerModel.factory().create();

		const foundModel = await useCase.execute({ id: model.id });

        expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			name: model.name,
			email: model.email,
			cellphone: model.cellphone,
			cpf: model.cpf,
			gender: model.gender,
			birth_date: model.birth_date,
			is_active: model.is_active,
			created_at: model.created_at,
			updated_at: model.updated_at,
		});
		
	});
});
