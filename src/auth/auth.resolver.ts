import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterAuthInput } from './dto/register-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { LoginAuthInput } from './dto/login-auth.input copy';
import { BadRequestException, Req, Res } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';


@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation('register')
  register(@Args('registerAuthInput') registerAuthInput: RegisterAuthInput) {
    return this.authService.register(registerAuthInput);
  }

  @Mutation('login')
  async login(
    @Args('loginAuthInput') loginAuthInput: LoginAuthInput,
    @Res({ passthrough: true }) res: Response
  ) {
    const accessToken = await this.authService.findOne(loginAuthInput);
   
    return accessToken; 
  }

  @Query('user') 
  findUser(@Context() context: any) {
    const headers = context.req.headers; 
    return this.authService.findOneByAccessToken(headers?.accesstoken);
  }

}
