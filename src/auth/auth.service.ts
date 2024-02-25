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
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(registerAuthInput.password, saltOrRounds);
      registerAuthInput.password = hash;
      this.userRepository.save(registerAuthInput);
      return registerAuthInput;
    } catch (error) {
      console.error('error in register', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findOne(loginDetails: LoginAuthInput) {
    try {
      const email = loginDetails.email;
      const user = await this.userRepository.findOne({ where: { email } }).then(async (user) => {

        if (!user) {
          throw new BadRequestException('user not found');
        }

        if (!await bcrypt.compare(loginDetails?.password, user?.password)) {
          throw new BadRequestException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({ id: user.id });

        return { accessToken };
      });

      return user;
    } catch (error) {
      console.error('error in findOne', error.message);
      throw new BadRequestException(error.message);
    }
  }

  async findOneByAccessToken(accessToken: string) {
    try {

      const data = await this.jwtService.verifyAsync(accessToken);
      const id = data.id;
      const user = await this.userRepository.findOne({ where: { id } }).then(async (user: Auth) => {
        const { password, ...userData } = user;
        return userData;
      });

      return user;
    } catch (error) {
      console.error('error in findOneByAccessToken', error.message);
      throw new BadRequestException(error.message);
    }
  }
}
