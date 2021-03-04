import { userRO } from "src/user/dto/userDto";
import { UserEntity } from "src/user/user.entity";
import { IdeaEntity } from "../idea.entity";

export interface ideaDto {
    idea: string;
    description: string;
}

export class ideaRO {
    id?: string;
    updated_at: Date;
    created_at: Date;
    idea: string;
    description: string;
    author: userRO;    
    upvotes?: number;
    downvotes?: number;
}