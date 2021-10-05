//core
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JwtService} from '@nestjs/jwt';
import bcrypt = require('bcrypt');

//entity
import {User, UserWithToken} from './user.entity';

//dto
import {LoginUserDTO} from './dto/login.dto';
import {SignUpUserDTO} from './dto/signUp.dto';
import {ChangeUserDataDTO} from "./dto/changeUserData.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
  }

  async login(loginData: LoginUserDTO): Promise<UserWithToken | Message> {
    const {password, email} = loginData;

    const user = await this.userRepository.findOne(
      {
        email,
        status: true
      }
    );

    const isPasswordMatching = user && (await bcrypt.compare(password, user.password));

    if (!isPasswordMatching){
      return {
        type: 'error',
        message: 'Пользователь не существует'
      }
    }
    const payload = {
      id: user.id,
    };
    const token = {token: this.jwtService.sign(payload)};
    return {...user, ...token};
  }

  async signUp(signUpData: SignUpUserDTO): Promise<UserWithToken | Message> {
    const {email} = signUpData;
    const user_temp = await this.userRepository.findOne({
      email
    });

    if (user_temp){
      return {
        type: 'error',
        message: 'Пользователь уже существует'
      }
    }

    const password = await bcrypt.hash(signUpData.password, 10);
    const user = await this.userRepository.save({...signUpData, password});
    const payload = {
      id: user.id,
    };
    const token = {token: this.jwtService.sign(payload)};
    return {...user, ...token};
  }

  async changeUserData(user: User, changeUserData: ChangeUserDataDTO): Promise<Message> {
    if (changeUserData.newPassword) {
      const isPasswordMatching = await bcrypt.compare(changeUserData.password, user.password);
      if (!isPasswordMatching) {
        return {
          type: 'error',
          message: 'Неверный пароль'
        }
      }
      user.password = await bcrypt.hash(changeUserData.newPassword, 10);
    }

    if (changeUserData.username) {
      user.username = changeUserData.username
    }

    if (changeUserData.email) {
      user.email = changeUserData.email
    }

    await this.userRepository.save(user);
    return {
      type: 'success',
      message: 'Данные успешно изменены'
    }
  }

  async findUser(user_id: number): Promise<User> {
    return await this.userRepository.findOne(
      {id: user_id, status: true}
    );
  }
}
