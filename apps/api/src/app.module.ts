import { Module } from '@nestjs/common';
import { ConfigModule, DatabaseModule, LoggerModule } from '@app/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
