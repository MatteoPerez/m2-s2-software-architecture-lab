import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { SQLitePostEntity } from 'src/modules/posts/infrastructure/entities/post.sqlite.entity';

@Entity('tags')
export class SQLiteTagEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    createdAt: Date;

    @ManyToMany(() => SQLitePostEntity, (post) => post.tags)
    posts: SQLitePostEntity[];
}
