import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CvsModule } from './cvs/cvs.module';
import { ProjectModule } from './projects/projects.module'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthsModule,
    UsersModule,
    CvsModule,
    ProjectModule,
    MongooseModule.forRoot(process.env.MONGO_URL as string),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
