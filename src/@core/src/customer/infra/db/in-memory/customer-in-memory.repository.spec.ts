import { Customer } from "#customer/domain/entities/customer";
import CustomerInMemoryRepository from "./customer-in-memory.repository";

describe('CustomerInMemoryRepository Unit Tests', () => {
    let repository: CustomerInMemoryRepository;

    beforeEach(() => {
        repository = new CustomerInMemoryRepository();
    });

    it('should return items without filter', async () => {
        const items = [
            new Customer({ name: 'Dog', type: 'dog', breed: 'labrador' }),
            new Customer({ name: 'Cat', type: 'cat', breed: 'persian' }),
            new Customer({ name: 'Bird', type: 'bird', breed: 'parrot' }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, null);

        expect(filterdItems).toStrictEqual(items);
        expect(spyFilterMethod).not.toHaveBeenCalled();        
    });

    it('should return items with filter', async () => {
        const items = [
            new Customer({ name: 'Dog', type: 'dog', breed: 'labrador' }),
            new Customer({ name: 'Cat', type: 'cat', breed: 'persian' }),
            new Customer({ name: 'Bird', type: 'bird', breed: 'parrot' }),
        ];

        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const filterdItems = await repository['applyFilter'](items, 'dog');

        expect(filterdItems).toStrictEqual([items[0]]);
        expect(spyFilterMethod).toHaveBeenCalled();        
    });

    it('should return items sorted by asc name when sort is null', async () => {
        const items = [
            new Customer({ name: 'Toto', type: 'dog', breed: 'labrador' }),
            new Customer({ name: 'Tom', type: 'cat', breed: 'persian' }),
            new Customer({ name: 'Little Bird', type: 'bird', breed: 'parrot' }),
        ];

        const sortedItems = await repository['applySort'](items, null, null);

        expect(sortedItems).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should return items sorted by type', async () => {
        const items = [
            new Customer({ name: 'Toto', type: 'dog', breed: 'labrador' }),
            new Customer({ name: 'Little Bird', type: 'bird', breed: 'parrot' }),
            new Customer({ name: 'Tom', type: 'cat', breed: 'persian' }),
        ];

        let sortedItems = await repository['applySort'](items, 'type', 'asc');
        expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

        sortedItems = await repository['applySort'](items, 'type', 'desc');
        expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

    });

    it('should return items sorted by breed', async () => {
        const items = [
            new Customer({ name: 'Toto', type: 'dog', breed: 'labrador' }),
            new Customer({ name: 'Tom', type: 'cat', breed: 'persian' }),
            new Customer({ name: 'Little Bird', type: 'bird', breed: 'parrot' }),
        ];

        let sortedItems = await repository['applySort'](items, 'breed', 'asc');
        expect(sortedItems).toStrictEqual([items[0], items[2], items[1]]);

        sortedItems = await repository['applySort'](items, 'breed', 'desc');
        expect(sortedItems).toStrictEqual([items[1], items[2], items[0]]);

    });

});