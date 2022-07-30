import Entity from "../entity/entity";
import UniqueEntityId from "../value-objects/unique-entity-id.vo";

export interface RepositoryInterface<T extends Entity> {
    insert(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    delete(id: string | UniqueEntityId): Promise<void>;
    findById(id: string | UniqueEntityId): Promise<T>;
    findAll(): Promise<T[]>;
}