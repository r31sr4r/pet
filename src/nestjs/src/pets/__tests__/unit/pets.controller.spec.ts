import { SortDirection } from 'pet-core/dist/@seedwork/domain/repository/repository-contracts';
import {
    CreatePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
    UpdatePetUseCase,
} from 'pet-core/pet/application';
import { CreatePetDto } from '../../dto/create-pet.dto';
import { UpdatePetDto } from '../../dto/update-pet.dto';
import { PetsController } from '../../pets.controller';
import { PetPresenter } from '../../presenter/pet.presenter';


describe('PetsController', () => {
    let controller: PetsController;

    beforeEach(async () => {
        controller = new PetsController();
    });

    it('should create a pet', async () => {
        const output: CreatePetUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Fluffy',
            type: 'cat',
            breed: 'persian',
            gender: 'female',
            is_active: true,
            birth_date: new Date('2021-04-01'),
            created_at: new Date(),
        };

        const mockCreateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(output)),
        };

        //@ts-expect-error
        controller['createUseCase'] = mockCreateUseCase;

        const input: CreatePetDto = {
            name: 'Fluffy',
            type: 'cat',
            breed: 'persian',
            gender: 'female',
            birth_date: new Date('2021-04-01'),
        };

        const presenter = await controller.create(input);
        expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
        expect(presenter).toBeInstanceOf(PetPresenter);
        expect(presenter).toStrictEqual(new PetPresenter(output));
    });

    it('shoult update a pet', async () => {
        const expectedOutput: UpdatePetUseCase.Output = {
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            name: 'Fluffy',
            type: 'cat',
            breed: 'persian',
            is_active: true,
            gender: null,
            birth_date: null,
            created_at: new Date(),
        };

        const mockUpdateUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['updateUseCase'] = mockUpdateUseCase;

        const input: UpdatePetDto = {
            name: 'Fluffy',
            type: 'cat',
            breed: 'persian',
            is_active: true,
        };

        const output = await controller.update(
            '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            input,
        );

        expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
            id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
            ...input,
        });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should delete a pet', async () => {
        const expectedOutput = undefined;
        const mockDeleteUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };

        //@ts-expect-error
        controller['deleteUseCase'] = mockDeleteUseCase;
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        expect(controller.remove(id)).toBeInstanceOf(Promise);

        const output = await controller.remove(id);
        expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should get a pet', async () => {
        const id = '3edaaad1-d538-4843-a6ef-9ebdaa69f10b';
        const expectedOutput: GetPetUseCase.Output = {
            id: id,
            name: 'Fluffy',
            type: 'cat',
            breed: 'persian',
            is_active: true,
            gender: null,
            birth_date: null,
            created_at: new Date(),
        };
        const mockGetUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
        };
        //@ts-expect-error
        controller['getUseCase'] = mockGetUseCase;
        const output = await controller.findOne(id);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
        expect(expectedOutput).toStrictEqual(output);
    });

    it('should search pets with filter', async () => {
        const expectdOutput: ListPetsUseCase.Output = {
            items: [
                {
                    id: '3edaaad1-d538-4843-a6ef-9ebdaa69f10b',
                    name: 'Fluffy',
                    type: 'cat',
                    breed: 'persian',
                    is_active: true,
                    gender: null,
                    birth_date: null,
                    created_at: new Date(),
                },
            ],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 1,
        };

        const mockListUseCase = {
            execute: jest.fn().mockReturnValue(Promise.resolve(expectdOutput)),
        };
        //@ts-expect-error
        controller['listUseCase'] = mockListUseCase;

        const searchParams = {
            page: 1,
            per_page: 10,
            sort: 'name',
            sort_dir: 'asc' as SortDirection,
            fiter: 'Fluffy',
        };

        const output = await controller.search(searchParams);

        expect(mockListUseCase.execute).toBeCalledWith(searchParams);
        expect(expectdOutput).toStrictEqual(output);
    });
});
