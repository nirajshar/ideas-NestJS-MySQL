import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: 'idea', synchronize: true })
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('text') idea: string;

    @Column('text') description: string;

    @CreateDateColumn() created_at: Date;

    @UpdateDateColumn() updated_at: Date;

    @ManyToOne(type => UserEntity, author => author.ideas)
    author: UserEntity;
}
