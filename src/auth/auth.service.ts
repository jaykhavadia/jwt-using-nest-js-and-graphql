import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAuthInput } from './dto/register-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthInput } from './dto/login-auth.input copy';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(@InjectRepository(Auth) private readonly userRepository: Repository<Auth>, private readonly jwtService: JwtService) {

  }

  async register(registerAuthInput: RegisterAuthInput) {
    console.log('registerAuthInput ', registerAuthInput);
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(registerAuthInput.password, saltOrRounds);
    console.log('hash created', hash);
    registerAuthInput.password = hash;
    this.userRepository.save(registerAuthInput);
    return registerAuthInput;
  }

  async findOne(loginDetails: LoginAuthInput) {
    console.log('i got this', loginDetails);
    const email = loginDetails.email;
    const user = await this.userRepository.findOne({ where: { email } }).then(async (user) => {

      if (!user) {
        throw new BadRequestException('user not found');
      }

      if (!await bcrypt.compare(loginDetails?.password, user?.password)) {
        throw new BadRequestException('Invalid credentials');
      }
      console.log('user', user);

      const accessToken = await this.jwtService.signAsync({ id: user.id });
      console.log('JWt token generated', accessToken);

      return { accessToken };
    });


    return user;
  }

  async findOneByAccessToken(accessToken: string) {
    const data = await this.jwtService.verifyAsync(accessToken);
    const id = data.id;
    const user = await this.userRepository.findOne({ where: { id } }).then(async (user: Auth) => {
      console.log('user', user);
      const {password, ...userData} = user;
      return userData;
    });

    return user;
  }
}
