import { Group } from '../../../../../domain/entities/group';
import NotFoundError from '../../../../../../@seedwork/domain/errors/not-found.error';
import GroupInMemoryRepository from '../../../../../infra/db/in-memory/group-in-memory.repository';
import { DeleteGroupUseCase } from '../../delete-group.use-case';

describe('DeleteGroupUseCase Unit Tests', () => {
    let repository: GroupInMemoryRepository;
    let useCase: DeleteGroupUseCase.UseCase;

    beforeEach(() => {
        repository = new GroupInMemoryRepository();
        useCase = new DeleteGroupUseCase.UseCase(repository);
    });

    it('should throw an error when group not found', async () => {
        await expect(useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError('Entity not found using ID fake id')
        );
    });

    it('should delete a group', async () => {
        const spyDelete = jest.spyOn(repository, 'delete');
        let items = [
            new Group({
                name: 'Test Group',
                description: 'Test Group Description',
            }),
        ];
        repository.items = items;
        await useCase.execute({ id: items[0].id });
        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(repository.items.length).toBe(0);
    });

});