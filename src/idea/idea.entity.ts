import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'Idea'})
export class IdeaEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('text') idea: string;

    @Column('text') description: string;

    @CreateDateColumn() created_at: Date;

    @CreateDateColumn() updated_at: Date;
}
