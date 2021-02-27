import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userDto, userRO } from './dto/userDto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

    async showAllUsers(): Promise<userRO[]> {
        const users = await this.userRepository.find();
        return users.map(user => user.toResponseObject(false));
    }

    async login(data: userDto): Promise<userRO> {

        const { username, password } = data;
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST,
            );
        }

        return user.toResponseObject(true);

    }

    async register(data: userDto): Promise<userRO> {
        const { username } = data;

        let user = await this.userRepository.findOne({ where: { username } });

        if ( user ) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        user = await this.userRepository.create(data);
        await this.userRepository.save(user);

        return user.toResponseObject(false);
    }
}
