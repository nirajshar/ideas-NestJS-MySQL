import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ideaDto } from './dto/ideaDto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>) { }

    async findAll() {
        return await this.ideaRepository.find();
    }

    async createOne(idea: ideaDto) {
        const createIdea = await this.ideaRepository.create(idea);
        await this.ideaRepository.save(createIdea)
        return createIdea;
    }

    async readOne(id) {
        return await this.ideaRepository.findOne({ where: { id } });
    }

    async updateOne(id, idea) {
        await this.ideaRepository.update({ id }, idea);
        return await this.ideaRepository.findOne({ id });
    }

    async deleteOne(id) {
        await this.ideaRepository.delete({ id });
        return {deleted : true};
    }
}
