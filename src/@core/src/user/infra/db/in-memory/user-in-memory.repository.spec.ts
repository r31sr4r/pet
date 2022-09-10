import { User } from "#user/domain/entities/user";
import UserInMemoryRepository from "./user-in-memory.repository";

describe('UserInMemoryRepository Unit Tests', () => {
    let repository: UserInMemoryRepository;

    beforeEach(() => {
        repository = new UserInMemoryRepository();
    });

    it('should return items without filter', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, null);

        expect(filterdItems).toStrictEqual(items);
        expect(spyFilterMethod).not.toHaveBeenCalled();        
    });

    it('should return items with filter', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, 'paulm');

        expect(filterdItems).toStrictEqual([items[0]]);
        expect(spyFilterMethod).toHaveBeenCalled();        
    });

    it('should return items sorted by asc name when sort is null', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const sortedItems = await repository['applySort'](items, null, null);

        expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
    });

    it('should return items sorted by desc name when sort is name and sort_dir is desc', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const sortedItems = await repository['applySort'](items, 'name', 'desc');
        expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });

    it('should return items sorted by asc name when sort is name and sort_dir is asc', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const sortedItems = await repository['applySort'](items, 'name', 'asc');
        expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);
    });


    it('should return items sorted by email', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        let sortedItems = await repository['applySort'](items, 'email', 'asc');
        expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

        sortedItems = await repository['applySort'](items, 'email', 'desc');
        expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
    
    it('should return items sorted by created_at field', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1', created_at: new Date('2020-01-01') }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123', created_at: new Date('2021-01-02') }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r', created_at: new Date('2020-01-03') }),
        ];

        let sortedItems = await repository['applySort'](items, 'created_at', 'asc');
        expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

        sortedItems = await repository['applySort'](items, 'created_at', 'desc');
        expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

    });



    it('should throw a error a NotFoundError when email was not found', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];

        const emailToFind = 'paulmcartney@mail.com';
        
        items.forEach((item) => {
            repository.insert(item);
        });

		await expect(repository.findByEmail(emailToFind)).rejects.toThrowError(
			`Entity not found using email ${emailToFind}`
		);        
    });

    it('should find a email', async () => {
        const items = [
            new User({ name: 'Paul Mcartney', email: 'paulm@mail.com', password: 'Paulm1' }),
            new User({ name: 'John Lennon', email: 'john@mail.com', password: 'John123' }),
            new User({ name: 'Ringo Starr', email: 'rigon@mail.com', password: 'Ring0st4r' }),
        ];
        
        items.forEach((item) => {
            repository.insert(item);
        });

        
        const user = await repository.findByEmail('paulm@mail.com');

        expect(user).toStrictEqual(items[0]);
        
    });
    

    


});