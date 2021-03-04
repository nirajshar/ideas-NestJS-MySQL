import { IsNotEmpty } from 'class-validator';
import { IdeaEntity } from 'src/idea/idea.entity';


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
    bookmarks?: IdeaEntity[];
}