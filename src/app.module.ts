import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthsModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
