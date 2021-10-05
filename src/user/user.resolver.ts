// import { Inject, UseGuards } from '@nestjs/common';
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//
// import { User, UserWithToken } from './user.entity';
// import { UserService } from './user.service';
// import { SignUpUserDTO } from './dto/signUp.dto';
// import { LoginUserDTO } from './dto/login.dto';
// import {JwtAuthGuard} from "./auth/jwt-auth.guard";
//
//
//
// @Resolver(() => User)
// export class UserResolver {
//   constructor(@Inject(UserService) private userService: UserService) {}
//
//   @Get()
//   @UseGuards(JwtAuthGuard)
//   async getCurrentUser(@CurrentUser() user_id: number): Promise<User | Error> {
//     return await this.userService.findUser(user_id);
//   }
//
//   @Mutation(() => UserWithToken)
//   async login(
//     @Args('loginData') loginData: LoginUserDTO,
//   ): Promise<UserWithToken | Error> {
//     return await this.userService.login(loginData);
//   }
//
//   @Mutation(() => UserWithToken)
//   async signUp(
//     @Args('signUpData') signUpData: SignUpUserDTO,
//   ): Promise<UserWithToken> {
//     return await this.userService.signUp(signUpData);
//   }
// }
