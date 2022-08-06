import { Model } from "sequelize";
import {Column, DataType, PrimaryKey, Table} from 'sequelize-typescript';

type PetModelProperties = {
    id: number;
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
    id: string;

    @Column({ allowNull: false, type: DataType.STRING(100) })
    name: string;

    @Column({ allowNull: false, type: DataType.STRING(50) })
    type: string;

    @Column({ type: DataType.STRING(50) })
    breed: string | null;

    @Column({ type: DataType.STRING(50) })
    gender: string | null;

    @Column({ type: DataType.DATE })
    birth_date: Date | null;

    @Column({ allowNull: false })
    is_active: boolean;

    @Column({ allowNull: false })
    created_at: Date;
}