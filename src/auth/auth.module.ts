import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register(
      {
        secret: 'secret',
        signOptions: { expiresIn: '1d' }
      }
    ),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule { }   