import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity({ name: 'user', synchronize: false })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid') id: string;

    @Column({
        type: 'text',
        unique: true
    })
    username: string;

    @Column('text') password: string;

    @CreateDateColumn() created_at: Date;

    @CreateDateColumn() updated_at: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toResponseObject(showToken: boolean) {
        const { id, created_at, username, token } = this;
        const responseObject: any = { id, created_at, username };
        if (showToken) {
            responseObject.token = token;
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
