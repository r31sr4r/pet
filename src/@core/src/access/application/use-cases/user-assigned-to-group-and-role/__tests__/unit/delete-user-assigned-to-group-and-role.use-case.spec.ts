import { UserAssignedToGroupAndRole } from '../../../../../domain/entities/user-assigned-to-group-and-role';
import NotFoundError from '../../../../../../@seedwork/domain/errors/not-found.error';
import UserAssignedToGroupAndRoleInMemoryRepository from '../../../../../infra/db/in-memory/user-assigned-to-group-and-role-in-memory.repository';
import { DeleteUserAssignedToGroupAndRoleUseCase } from '../../delete-user-assigned-to-group-and-role.use-case';

describe('DeleteUserAssignedToGroupAndRoleUseCase Unit Tests', () => {
    let repository: UserAssignedToGroupAndRoleInMemoryRepository;
    let useCase: DeleteUserAssignedToGroupAndRoleUseCase.UseCase;

    beforeEach(() => {
        repository = new UserAssignedToGroupAndRoleInMemoryRepository();
        useCase = new DeleteUserAssignedToGroupAndRoleUseCase.UseCase(repository);
    });

    it('should throw an error when role not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a role', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new UserAssignedToGroupAndRole({
                user_id: '104508d2-0e18-4bd1-a0f1-2de75a835801',
                group_id: 'da1f112e-c82a-492d-8e27-a33b54739717',
                role_id: 'de2ff617-3765-489d-9ee7-8dc29f1db061',
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});