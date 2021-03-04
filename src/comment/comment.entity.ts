import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IdeaEntity } from "src/idea/idea.entity";
import { UserEntity } from "src/user/user.entity";

@Entity({ name: 'comment', synchronize: true })
export class CommentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity;

}
