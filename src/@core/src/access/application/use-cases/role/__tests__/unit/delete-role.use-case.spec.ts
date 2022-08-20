import { Role } from '../../../../../domain/entities/role';
import NotFoundError from '../../../../../../@seedwork/domain/errors/not-found.error';
import RoleInMemoryRepository from '../../../../../infra/db/in-memory/role-in-memory.repository';
import { DeleteRoleUseCase } from '../../delete-role.use-case';

describe('DeleteRoleUseCase Unit Tests', () => {
    let repository: RoleInMemoryRepository;
    let useCase: DeleteRoleUseCase.UseCase;

    beforeEach(() => {
        repository = new RoleInMemoryRepository();
        useCase = new DeleteRoleUseCase.UseCase(repository);
    });

    it('should throw an error when role not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a role', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new Role({
                name: 'Test Role',
                description: 'Test Role Description',
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});