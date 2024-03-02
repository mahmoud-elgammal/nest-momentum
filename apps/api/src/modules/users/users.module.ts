import { UserService } from './users.service';
import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { DatabaseModule } from '@app/common';
import { UserDocument, UserSchema } from './models/users.model';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{name: UserDocument.name, schema: UserSchema}])],
    providers: [UserRepository, UserService],
    exports: [UserService]
})
export class UsersModule {}
