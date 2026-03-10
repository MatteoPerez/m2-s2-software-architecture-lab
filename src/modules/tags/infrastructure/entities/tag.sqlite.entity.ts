import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tags')
export class SQLiteTagEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    createdAt: Date;
}
