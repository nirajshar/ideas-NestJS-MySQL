import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { ideaDto } from './dto/ideaDto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {

    private logger = new Logger('IdeaController');

    constructor(private ideaService: IdeaService) {}

    private logData(options: any ) {
        // console.log(options);        
        options.userId && this.logger.log('USER' + JSON.stringify(options.userId) );
        options.data && this.logger.log('DATA' + JSON.stringify(options.data) );
        options.id && this.logger.log('IDEA' + JSON.stringify(options.id) );
    }

    @Get()
    @UseGuards(new AuthGuard())
    findAll(@User('id') userId) {
        return this.ideaService.findAll(userId);
    }

    @Post()
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    createOne(@User('id') userId, @Body() data: ideaDto) {
        this.logData({userId, data});
        return this.ideaService.createOne(userId, data);
    }

    @Get(':id')
    @UseGuards(new AuthGuard())
    readOne(@Param('id') id: string) {
        return this.ideaService.readOne(id);
    }

    @Put(':id')
    @UseGuards(new AuthGuard())
    @UsePipes(new ValidationPipe())
    updateOne(@Param('id') id: string, @User('id') userId, @Body() data: Partial<ideaDto>): {} {
        this.logData({id, userId, data});
        return this.ideaService.updateOne(id, userId, data);
    }

    @Delete(':id')
    @UseGuards(new AuthGuard())    
    deleteOne(@Param('id') id: string, @User('id') userId) {
        this.logData({id, userId})
        return this.ideaService.deleteOne(id, userId);
    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({id, userId});
        return this.ideaService.bookmarkIdea(id, userId);
    }

    
    @Delete(':id/bookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
        this.logData({id, userId});  
        return this.ideaService.unbookmarkIdea(id, userId);
    }
}
