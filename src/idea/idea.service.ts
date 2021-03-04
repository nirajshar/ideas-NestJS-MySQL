import { HttpException, HttpStatus, Injectable, Param, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { relative } from 'path';
import { AuthGuard } from 'src/shared/auth.guard';
import { HttpErrorFilter } from 'src/shared/http-error.filter';
import { Votes } from 'src/shared/votes.enum';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ideaDto, ideaRO } from './dto/ideaDto';
import { IdeaEntity } from './idea.entity';

@Injectable()
export class IdeaService {

    constructor(@InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }


    private toResponseObject(idea: IdeaEntity): ideaRO {
        const responseObject: any = { ...idea, author: idea.author.toResponseObject(false) };

        if (responseObject.upvotes) {
            responseObject.upvotes = responseObject.upvotes.length;
        }
        if (responseObject.downvotes) {
            responseObject.downvotes = responseObject.downvotes.length;
        }
        return responseObject;
    }

    async findAll(userId): Promise<ideaRO[]> {
        const ideas = await this.ideaRepository.find({ relations: ['author', 'upvotes', 'downvotes','comments'] });
        // const ideas = await this.ideaRepository.find({ where: { author: userId }, relations: ['author', 'upvotes', 'downvotes'] });
        return ideas.map(idea => this.toResponseObject(idea));
    }

    async createOne(userId: string, data: ideaDto): Promise<ideaRO> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const idea = await this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea)
        return this.toResponseObject(idea);
    }

    async readOne(id): Promise<ideaRO> {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes','comments'] });
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
        idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] });
        return this.toResponseObject(idea);
    }

    async deleteOne(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'comments'] })
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

    async bookmarkIdea(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already bookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);

    }

    async unbookmarkIdea(id: string, userId: string) {

        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] });


        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
            user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
            await this.userRepository.save(user);
        } else {
            throw new HttpException('Idea already not bookmarked', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);

    }

    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {

        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;

        if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
            idea[vote].push(user);
            await this.ideaRepository.save(idea);
        } else if (
            idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
            idea[vote].filter(voter => voter.id === user.id).length > 0
        ) {
            idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
            idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
            await this.ideaRepository.save(idea);
        } else {
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }

        return idea;
    }


    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        idea = await this.vote(idea, user, Votes.UP);

        return this.toResponseObject(idea);
    }

    async downvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comments'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        idea = await this.vote(idea, user, Votes.DOWN);

        return this.toResponseObject(idea);

    }
}
