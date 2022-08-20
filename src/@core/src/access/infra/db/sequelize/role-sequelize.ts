import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '../../../../@seedwork/infra/sequelize/sequelize-model-factory';
import { Role, RoleRepository } from '#access/domain/index';
import { Op } from 'sequelize';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain';

export namespace RoleSequelize {
	type RoleModelProps = {
		id: string;
		name: string;
		description: string;
		is_active: boolean;
		created_at: Date;
	};

	@Table({ tableName: 'roles', timestamps: false })
	export class RoleModel extends Model<RoleModelProps> {
		@PrimaryKey
		@Column({ type: DataType.UUID })
		declare id: string;

		@Column({ allowNull: false, type: DataType.STRING(255) })
		declare name: string;

		@Column({ allowNull: false, type: DataType.TEXT })
		declare description: string | null;

		@Column({ allowNull: false, type: DataType.BOOLEAN })
		declare is_active: boolean;

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		static factory() {
			const chance: Chance.Chance = require('chance')();
			return new SequelizeModelFactory<RoleModel, RoleModelProps>(
				RoleModel,
				() => ({
					id: chance.guid({ version: 4 }),
					name: chance.word({ length: 10 }),
					description: chance.paragraph(),
					is_active: true,
					created_at: chance.date(),
				})
			);
		}
	}

	export class RoleSequelizeRepository
		implements RoleRepository.Repository
	{
		sortableFields: string[] = ['name', 'created_at'];

		constructor(private roleModel: typeof RoleModel) {}

		async exists(_name: string): Promise<boolean> {
			throw new Error('Method not implemented.');
		}

		async insert(entity: Role): Promise<void> {
			await this.roleModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<Role> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return RoleModelMapper.toEntity(model);
		}

		async findAll(): Promise<Role[]> {
			const models = await this.roleModel.findAll();
			return models.map((m) => RoleModelMapper.toEntity(m));
		}

		async update(entity: Role): Promise<void> {
			await this._get(entity.id);
			await this.roleModel.update(entity.toJSON(), {
				where: { id: entity.id },
			});
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			const _id = `${id}`;
			await this._get(_id);
			await this.roleModel.destroy({ where: { id: _id } });
		}

		private async _get(id: string): Promise<RoleModel> {
			return this.roleModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: RoleRepository.SearchParams
		): Promise<RoleRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } =
				await this.roleModel.findAndCountAll({
					...(props.filter && {
						where: { name: { [Op.like]: `%${props.filter}%` } },
					}),
					...(props.sort && this.sortableFields.includes(props.sort)
						? { order: [[props.sort, props.sort_dir]] }
						: { order: [['created_at', 'DESC']] }),
					offset,
					limit,
				});
			return new RoleRepository.SearchResult({
				items: models.map((m) => RoleModelMapper.toEntity(m)),
				current_page: props.page,
				per_page: props.per_page,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sort_dir: props.sort_dir,
			});
		}
	}

	export class RoleModelMapper {
		static toEntity(model: RoleModel): Role {
			const { id, ...otherData } = model.toJSON();

			try {
				return new Role(otherData, new UniqueEntityId(id));
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}

				throw e;
			}
		}
	}
}
