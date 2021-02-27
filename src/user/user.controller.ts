import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { userDto, userRO } from './dto/userDto';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(private userService: UserService) { }

    @Get('api/users')
    showAllUsers() {
        return this.userService.showAllUsers();
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
