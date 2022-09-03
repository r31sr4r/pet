import {
	Column,
	DataType,
	PrimaryKey,
	Table,
	Model,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { SequelizeModelFactory } from '../../../../@seedwork/infra/sequelize/sequelize-model-factory';
import { UserAssignedToGroupAndRole, UserAssignedToGroupAndRoleRepository } from '#access/domain/index';
import {
	NotFoundError,
	UniqueEntityId,
	EntityValidationError,
	LoadEntityError,
} from '#seedwork/domain';
import { UserSequelize } from '#user/infra/db/sequelize/user-sequelize';
import { GroupSequelize } from './group-sequelize';
import { RoleSequelize } from './role-sequelize';
import { Op } from 'sequelize';

export namespace UserAssignedToGroupAndRoleSequelize {
	type UserAssignedToGroupAndRoleModelProps = {
		id: string;
		user_id: string;
        group_id: string;
        role_id: string;		
		created_at: Date;
	};

	@Table({ tableName: 'userAssignedToGroupAndRole', timestamps: false })
	export class UserAssignedToGroupAndRoleModel extends Model<UserAssignedToGroupAndRoleModelProps> {
		@PrimaryKey
		@Column({ allowNull: false, type: DataType.UUID })
		declare id: string;

        @ForeignKey(() => UserSequelize.UserModel)
        @Column({ allowNull: false, type: DataType.UUID })
        declare user_id: string;

		@BelongsTo(() => UserSequelize.UserModel)
		declare user: UserSequelize.UserModel;

        @ForeignKey(() => GroupSequelize.GroupModel)
        @Column({ allowNull: false, type: DataType.UUID })
        declare group_id: string;

        @BelongsTo(() => GroupSequelize.GroupModel)
		declare group: GroupSequelize.GroupModel;

        @ForeignKey(() => RoleSequelize.RoleModel)
        @Column({ allowNull: false, type: DataType.UUID })
        declare role_id: string;

        @BelongsTo(() => RoleSequelize.RoleModel)
		declare role: RoleSequelize.RoleModel;

		@Column({ allowNull: false, type: DataType.DATE })
		declare created_at: Date;

		static async factory() {
			const chance: Chance.Chance = require('chance')();
			const user = await UserSequelize.UserModel.factory().create();
            const group = await GroupSequelize.GroupModel.factory().create();
            const role = await RoleSequelize.RoleModel.factory().create();

			return new SequelizeModelFactory<UserAssignedToGroupAndRoleModel, UserAssignedToGroupAndRoleModelProps>(
				UserAssignedToGroupAndRoleModel,
				() => ({
					id: chance.guid({ version: 4 }),
                    user_id: user.id,
                    group_id: group.id,
                    role_id: role.id,
					created_at: chance.date(),
				})
			);
		}
	}

	export class UserAssignedToGroupAndRoleSequelizeRepository
		implements UserAssignedToGroupAndRoleRepository.Repository
	{
		sortableFields: string[] = ['user_id', 'created_at'];

		constructor(private userAssignedToGroupAndRoleModel: typeof UserAssignedToGroupAndRoleModel) {}

		async exists(_name: string): Promise<boolean> {
			throw new Error('Method not implemented.');
		}

		async insert(entity: UserAssignedToGroupAndRole): Promise<void> {
			await this.userAssignedToGroupAndRoleModel.create(entity.toJSON());
		}

		async findById(id: string | UniqueEntityId): Promise<UserAssignedToGroupAndRole> {
			const _id = `${id}`;
			const model = await this._get(_id);
			return UserAssignedToGroupAndRoleModelMapper.toEntity(model);
		}

		async findAll(): Promise<UserAssignedToGroupAndRole[]> {
			const models = await this.userAssignedToGroupAndRoleModel.findAll();
			return models.map((m) => UserAssignedToGroupAndRoleModelMapper.toEntity(m));
		}

		async update(entity: UserAssignedToGroupAndRole): Promise<void> {
			await this._get(entity.id);
			await this.userAssignedToGroupAndRoleModel.update(entity.toJSON(), {
				where: { id: entity.id },
			});
		}

		async delete(id: string | UniqueEntityId): Promise<void> {
			const _id = `${id}`;
			await this._get(_id);
			await this.userAssignedToGroupAndRoleModel.destroy({ where: { id: _id } });
		}

		private async _get(id: string): Promise<UserAssignedToGroupAndRoleModel> {
			return this.userAssignedToGroupAndRoleModel.findByPk(id, {
				rejectOnEmpty: new NotFoundError(
					`Entity not found using ID ${id}`
				),
			});
		}

		async search(
			props: UserAssignedToGroupAndRoleRepository.SearchParams
		): Promise<UserAssignedToGroupAndRoleRepository.SearchResult> {
			const offset = (props.page - 1) * props.per_page;
			const limit = props.per_page;
			const { rows: models, count } =
				await this.userAssignedToGroupAndRoleModel.findAndCountAll({
					...(props.filter && {
						where: { user_id: { [Op.like]: `%${props.filter}%` } },
					}),
					...(props.sort && this.sortableFields.includes(props.sort)
						? { order: [[props.sort, props.sort_dir]] }
						: { order: [['created_at', 'DESC']] }),
					offset,
					limit,
				});
			return new UserAssignedToGroupAndRoleRepository.SearchResult({
				items: models.map((m) => UserAssignedToGroupAndRoleModelMapper.toEntity(m)),
				current_page: props.page,
				per_page: props.per_page,
				total: count,
				filter: props.filter,
				sort: props.sort,
				sort_dir: props.sort_dir,
			});
		}
	}

	export class UserAssignedToGroupAndRoleModelMapper {
		static toEntity(model: UserAssignedToGroupAndRoleModel): UserAssignedToGroupAndRole {
			const { id, ...otherData } = model.toJSON();

			try {
				return new UserAssignedToGroupAndRole(otherData, new UniqueEntityId(id));
			} catch (e) {
				if (e instanceof EntityValidationError) {
					throw new LoadEntityError(e.error);
				}

				throw e;
			}
		}
	}
}
