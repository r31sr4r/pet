import Entity from '../entity/entity';
import NotFoundError from '../errors/not-found-error';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';
import InMemoryRepository from './in-memory.repository';

type StubEntityProps = {
	name: string;
	price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
	let repository: StubInMemoryRepository;

	beforeEach(() => {
		repository = new StubInMemoryRepository();
	});

	it('should inserts a new entity', async () => {
		const entity = new StubEntity({ name: 'test', price: 1 });
		await repository.insert(entity);
		expect(entity.toJSON()).toStrictEqual(repository.items[0].toJSON());
	});

	it('should throws error on update when entity not found', async () => {
		const entity = new StubEntity({ name: 'test', price: 1 });
		await expect(repository.update(entity)).rejects.toThrow(
			new NotFoundError(`Item with id ${entity.id} not found`)
		);
	});

	it('should update an existing entity', async () => {
		const entity = new StubEntity({ name: 'test', price: 1 });
		await repository.insert(entity);
		const updatedEntity = new StubEntity(
			{ name: 'test2', price: 2 },
			entity.uniqueEntityId
		);

		await repository.update(updatedEntity);
        
		expect(updatedEntity.toJSON()).toStrictEqual(
			repository.items[0].toJSON()
		);
	});

	it('should throw an error on delete when entity not found', async () => {
		expect(repository.delete('fake id')).rejects.toThrow(
			new NotFoundError('Item with id fake id not found')
		);

		expect(
			repository.delete(
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			)
		).rejects.toThrow(
			new NotFoundError(
				'Item with id 02b090cf-5658-4073-b242-9bf64915b3ad not found'
			)
		);
	});

	it('should delete an existing entity', async () => {
		const entity = new StubEntity({ name: 'test', price: 1 });
		await repository.insert(entity);
		await repository.delete(entity.id);
		expect(repository.items.length).toBe(0);
        
        await repository.insert(entity);
        await repository.delete(entity.uniqueEntityId);
        expect(repository.items).toHaveLength(0);
	});

	it('should throw an error when entity not found', async () => {
		expect(repository.findById('fake id')).rejects.toThrow(
			new NotFoundError('Item with id fake id not found')
		);

		expect(
			repository.findById(
				new UniqueEntityId('02b090cf-5658-4073-b242-9bf64915b3ad')
			)
		).rejects.toThrow(
			new NotFoundError(
				'Item with id 02b090cf-5658-4073-b242-9bf64915b3ad not found'
			)
		);
	});

	it('should find an existing entity', async () => {
		const entity = new StubEntity({ name: 'test', price: 1 });
		await repository.insert(entity);

		let foundEntity = await repository.findById(entity.id);
		expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());

		foundEntity = await repository.findById(entity.uniqueEntityId);
		expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON());
	});

	it('should find all entities', async () => {
		const entity1 = new StubEntity({ name: 'test', price: 1 });
		const entity2 = new StubEntity({ name: 'test2', price: 2 });
		await repository.insert(entity1);
		await repository.insert(entity2);

		const foundEntities = await repository.findAll();
		expect(foundEntities.length).toBe(2);
		expect(foundEntities[0].toJSON()).toStrictEqual(entity1.toJSON());
		expect(foundEntities[1].toJSON()).toStrictEqual(entity2.toJSON());
		expect(foundEntities).toStrictEqual([entity1, entity2]);
	});
});
