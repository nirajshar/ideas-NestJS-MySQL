import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { commentDto } from './dto/commentDto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }


    private toResponseObject(comment: CommentEntity) {
        return {
            ...comment,
            author: comment.author && comment.author.toResponseObject(),            
        };
    }

    async showComment(id: string) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author','idea']
        });
       
        return this.toResponseObject(comment);
    }

    async createComment(ideaId: string, userId: string, data: commentDto) {
        const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        const comment = this.commentRepository.create({
            ...data,
            idea,
            author: user.toResponseObject(false)
        });

        await this.commentRepository.save(comment);

        return this.toResponseObject(comment);
    }


    async destroyComment(id: string, userId: string) {


        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author', 'idea']
        });
        console.log(comment);


        if (comment.author.id !== userId) {
            throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED)
        }

        await this.commentRepository.remove(comment);

        return this.toResponseObject(comment);

    }

    async showCommentsByIdea(ideaId: string) {
        const idea = await this.ideaRepository.findOne({
            where: { id: ideaId },
            relations: ['comments', 'comments.author', 'comments.idea']
        });

        return idea.comments;
    }

    async showCommentsByUser(userId: string) {
        const comments = await this.commentRepository.find({
            where: { author: { id: userId } },
            relations: ['author']
        });

        return comments.map(comment => this.toResponseObject(comment));
    }


}
