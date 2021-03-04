import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userRO } from "./dto/userDto";
import { IdeaEntity } from "src/idea/idea.entity";

@Entity({ name: 'user', synchronize: true })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid') id: string;

    @Column({
        type: 'text',
        unique: true
    })
    username: string;

    @Column('text') password: string;

    @CreateDateColumn() created_at: Date;

    @UpdateDateColumn() updated_at: Date;

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[];

    @ManyToMany(type => IdeaEntity, { cascade: true })
    @JoinTable()
    bookmarks: IdeaEntity[];


    // --------- Developer defined Utilities for Entity

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject(showToken: boolean = false): userRO {
        const { id, created_at, username, token } = this;
        const responseObject: any = { id, created_at, username };
        if (showToken) {
            responseObject.token = token;
        }

        if (this.ideas) {
            responseObject.ideas = this.ideas;
        }

        if (this.bookmarks) {
            responseObject.bookmarks = this.bookmarks;
        }

        return responseObject;
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    private get token() {
        const { id, username } = this;

        return jwt.sign(
            {
                id,
                username,
            },
            process.env.SECRET,
            { expiresIn: '7d' }
        );
    }

}
