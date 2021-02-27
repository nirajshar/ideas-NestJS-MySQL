import { IsNotEmpty } from 'class-validator';


export class userDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class userRO {
    id: string;
    username: string;
    created_at: Date;
    token?: string;
}