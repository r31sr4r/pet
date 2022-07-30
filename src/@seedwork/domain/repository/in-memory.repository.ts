import Entity from '../entity/entity';
import NotFoundError from '../errors/not-found.error';
import UniqueEntityId from '../value-objects/unique-entity-id.vo';
import { RepositoryInterface } from './repository-contracts';

export default abstract class InMemoryRepository<T extends Entity>
	implements RepositoryInterface<T>
{
	items: T[] = [];

	async insert(entity: T): Promise<void> {
		this.items.push(entity);
	}

	async update(entity: T): Promise<void> {
		await this._get(entity.id);
		const indexFound = this.items.findIndex((i) => i.id === entity.id);
		this.items[indexFound] = entity;
	}

	async delete(id: string | UniqueEntityId): Promise<void> {
		const _id = `${id}`;
		await this._get(_id);
		const indexFound = this.items.findIndex((i) => i.id === _id);
		this.items.splice(indexFound, 1);
	}

	async findById(id: string | UniqueEntityId): Promise<T> {
		const _id = `${id}`;
		return this._get(_id);
	}

	async findAll(): Promise<T[]> {
		return this.items;
	}

	protected async _get(id: string): Promise<T> {
		const item = this.items.find((i) => i.id === id);
		if (!item) {
			throw new NotFoundError(`Item with id ${id} not found`);
		}
		return item;
	}
}
