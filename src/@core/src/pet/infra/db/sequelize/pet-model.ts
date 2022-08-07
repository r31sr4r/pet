import {Column, DataType, PrimaryKey, Table, Model} from 'sequelize-typescript';

type PetModelProperties = {
    id: string;
    name: string;
    type: string;
    breed: string;
    gender: string;
    birth_date: Date;
    is_active: boolean;
    created_at: Date;
}

@Table({ tableName: 'pets', timestamps: false })
export class PetModel extends Model<PetModelProperties> {
    @PrimaryKey
    @Column({type: DataType.UUID})
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    declare name: string;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    declare type: string;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    declare breed: string | null;

    @Column({ allowNull: true, type: DataType.STRING(50) })
    declare gender: string | null;

    @Column({ allowNull: true, type: DataType.DATE })
    declare birth_date: Date | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;
}