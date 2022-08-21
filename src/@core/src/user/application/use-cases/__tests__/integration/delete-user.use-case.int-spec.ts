import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { DeleteUserUseCase } from '../../delete-user.use-case';
import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { UserSequelizeRepository, UserModel } = UserSequelize;
describe('DeleteUserUseCase Integration Tests', () => {
	let repository: UserSequelize.UserSequelizeRepository;
	let useCase: DeleteUserUseCase.UseCase;

    setupSequelize({ models: [UserModel] });

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		useCase = new DeleteUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should delete a user', async () => {
		const model = await UserModel.factory().create();

		await useCase.execute({ id: model.id });
        const foundModel = await UserModel.findByPk(model.id);

        expect(foundModel).toBeNull();
		
	});
});
