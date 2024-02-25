import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Auth } from './auth/entities/auth.entity';

@Module({
  imports: [AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
    TypeOrmModule.forRootAsync(
      {
        useFactory: () => {
          return ({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'admin',
            database: 'postgres',
            entities: [
              Auth,
            ],
            synchronize: true,
          });
        },
      }
    ),
    TypeOrmModule.forFeature([Auth])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
