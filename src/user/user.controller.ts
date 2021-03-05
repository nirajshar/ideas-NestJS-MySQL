import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { userDto, userRO } from './dto/userDto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private userService: UserService) { }

    @Get('api/users')
    @UseGuards(new AuthGuard())
    showAllUsers(@Query('page') page: number) {        
        return this.userService.showAllUsers(page);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: userDto) {
        return this.userService.login(data);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() data: userDto) {
        return this.userService.register(data);
    }

}
