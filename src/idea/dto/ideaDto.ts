import { userRO } from "src/user/dto/userDto";

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
}