import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorFilter } from 'src/shared/http-error.filter';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ideaDto, ideaRO } from './dto/ideaDto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }


    private toResponseObject(idea: IdeaEntity): ideaRO {
        return { ...idea, author: idea.author.toResponseObject(false) };
    }

    async findAll(userId): Promise<ideaRO[]> {
        // const ideas = await this.ideaRepository.find({ relations: ['author'] });
        const ideas = await this.ideaRepository.find({  where: { author: userId }, relations: ['author'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async createOne(userId: string, data: ideaDto): Promise<ideaRO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = await this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea)
        return this.toResponseObject(idea);
    }

    async readOne(id): Promise<ideaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }

    async updateOne(id, userId, data): Promise<ideaRO> {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })

        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
        return this.toResponseObject(idea);
    }

    async deleteOne(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] })
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({ id });
        return this.toResponseObject(idea);
    }

    // Helper Function to ensure Creator & Updator/Deletor is same
    private ensureOwnership(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
        }
    }
}
