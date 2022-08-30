import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { DeleteCustomerUseCase } from '../../delete-customer.use-case';
import { CustomerSequelize } from '#customer/infra/db/sequelize/customer-sequelize';
import { setupSequelize } from '#seedwork/infra';
import { PetSequelize } from '#pet/infra';

const { CustomerSequelizeRepository, CustomerModel } = CustomerSequelize;
describe('DeleteCustomerUseCase Integragion Tests', () => {
	let repository: CustomerSequelize.CustomerSequelizeRepository;
	let useCase: DeleteCustomerUseCase.UseCase;

    setupSequelize({ models: [CustomerModel, PetSequelize.PetModel] });

	beforeEach(() => {
		repository = new CustomerSequelizeRepository(CustomerModel);
		useCase = new DeleteCustomerUseCase.UseCase(repository);
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

		await useCase.execute({ id: model.id });
        const foundModel = await CustomerModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
