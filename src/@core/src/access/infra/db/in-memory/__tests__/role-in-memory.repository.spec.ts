import { Role } from "#access/domain/entities/role";
import RoleInMemoryRepository from "../role-in-memory.repository";

describe('RoleInMemoryRepository Unit Tests', () => {
    let repository: RoleInMemoryRepository;
    beforeEach(() => {
        repository = new RoleInMemoryRepository();
    });


    it('should return items without filter', async () => {
        const items = [
            new Role({ name: 'Role 1', description: 'Role 1 Description'  }), 
            new Role({ name: 'Role 2', description: 'Role 2 Description'  }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, null);
        expect(filterdItems).toStrictEqual(items);
        expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should return filtered items when filter is not null', async () => {
        const items = [ 
            new Role({ name: 'Role 1', description: 'Role 1 Description'  }),
            new Role({ name: 'Test 2', description: 'Test 2 Description'  }),
            new Role({ name: 'Some Role 3', description: 'Some Role 3 Description'  }),
            new Role({ name: 'other 4', description: 'other 4 Description'  }),
            new Role({ name: 'another one 5', description: 'another one 5 Description'  }),
            new Role({ name: 'Role 6', description: 'Role 6 Description'  }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);
        let filterdItems = await repository['applyFilter'](items, 'Role');
        expect(filterdItems).toStrictEqual([items[0], items[2], items[5]]);
        expect(spyFilterMethod).toHaveBeenCalledTimes(1);

        filterdItems = await repository['applyFilter'](items, '5');
        expect(filterdItems).toStrictEqual([items[4]]);
        expect(spyFilterMethod).toHaveBeenCalledTimes(2);

        filterdItems = await repository['applyFilter'](items, 'no-filter');
        expect(filterdItems).toHaveLength(0);
        expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });

    it('should return all roles with created_at sort when sort is null', async () => {
        const created_at = new Date();
        const created_at2 = new Date('2020-01-01');
        const created_at3 = new Date('2021-04-02');

        const items = [
            new Role({ name: 'Role 1', description: 'Some description' , created_at: created_at }),
            new Role({ name: 'Role 2', description: 'Some description 2' , created_at: created_at2 }),
            new Role({ name: 'Role 3', description: 'Some description 3' , created_at: created_at3 }),
        ];

        let sortedItems = await repository['applySort'](items, null, null);
        expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);
    });

    it('should return sorted roles when sort is not null', async () => {
        const items = [
            new Role({ name: 'Group 1', description: 'desc 1' }),
            new Role({ name: 'Some Role', description: 'desc 2' }),
            new Role({ name: 'Other', description: 'desc 3' }),
            new Role({ name: 'another one', description: 'desc 4', is_active: false }),
            new Role({ name: 'caTegoRY ', description: 'desc 5' }),
        ]

        let sortedItems = await repository['applySort'](items, 'name', 'asc');

        expect(sortedItems).toStrictEqual([
            items[0],
            items[2],
            items[1],
            items[3],
            items[4],
        ]);      
        
        sortedItems = await repository['applySort'](items, 'name', 'desc');
        expect(sortedItems).toStrictEqual([
            items[4],
            items[3],
            items[1],
            items[2],
            items[0],
        ]);
        
    });
});