import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { CommentService } from './comment.service';
import { commentDto } from './dto/commentDto';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get(':id')
    showComment(@Param('id') id: string) {
        return this.commentService.showComment(id);
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createComment(@Param('id') ideaId: string, @User('id') userId: string, @Body() data: commentDto) {
        return this.commentService.createComment(ideaId, userId, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())
    destroyComment(@Param('id') id: string, @User('id') userId: string) {
        return this.commentService.destroyComment(id, userId);
    }

    @Get('idea/:id')
    showCommentsByIdea(@Param('id') ideaId: string) {
        return this.commentService.showCommentsByIdea(ideaId);
    }

    @Get('user/:id')
    showCommentsByUser(@Param('id') userId: string) {
        return this.commentService.showCommentsByUser(userId);
    }


   

}
