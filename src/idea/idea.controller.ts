import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ideaDto } from './dto/ideaDto';
import { IdeaService } from './idea.service';

@Controller('idea')
export class IdeaController {

    constructor(private ideaService: IdeaService) {}

    @Get()
    findAll(): {} {
        return this.ideaService.findAll();
    }

    @Post()
    createOne(@Body() idea: ideaDto) {
        return this.ideaService.createOne(idea);
    }

    @Get(':id')
    readOne(@Param('id') id: string) {
        return this.ideaService.readOne(id);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() idea: Partial<ideaDto>): {} {
        return this.ideaService.updateOne(id, idea);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): {} {
        return this.ideaService.deleteOne(id);
    }
}
