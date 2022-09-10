import NotFoundError from '../../../../../@seedwork/domain/errors/not-found.error';
import { GetUserUseCase } from '../../get-user.use-case';
import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import { setupSequelize } from '#seedwork/infra';

const { UserSequelizeRepository, UserModel } = UserSequelize;
describe('DeleteUserUseCase Integragion Tests', () => {
	let repository: UserSequelize.UserSequelizeRepository;
	let useCase: GetUserUseCase.UseCase;

    setupSequelize({ models: [UserModel] });

	beforeEach(() => {
		repository = new UserSequelizeRepository(UserModel);
		useCase = new GetUserUseCase.UseCase(repository);
	});

	it('should throw an error when user not found', async () => {
		await expect(() =>
			useCase.execute({ id: 'not-found' })
		).rejects.toThrow(
			new NotFoundError('Entity not found using ID not-found')
		);
	});

	it('should return a user', async () => {
		const model = await UserModel.factory().create();

		const foundModel = await useCase.execute({ id: model.id });

        expect(foundModel).not.toBeNull();
		expect(foundModel).toStrictEqual({
			id: model.id,
			name: model.name,
			email: model.email,
			password: model.password,
			is_active: model.is_active,
			created_at: model.created_at,
		});
		
	});
});
