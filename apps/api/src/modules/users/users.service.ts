import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/';
import { UserRepository } from './users.repository';
import { UserDocument } from './models/users.model';
import { UniqueEmailException } from 'src/exceptions';
import { UserNotFoundException } from 'src/exceptions/user-not-found.exception';
import { IncorrectPasswordException } from 'src/exceptions/incorrect-password.exception';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Asynchronously creates a new user based on the provided data.
   *
   * @param createUserDTO - The data object containing user information.
   * @returns A promise resolving to the created user.
   * @throws UniqueEmailException if the provided email is already associated with an existing user.
   */
  async create(createUserDTO: CreateUserDTO): Promise<UserDocument> {
    const exists = await this.userRepository.exists({
      email: createUserDTO.email,
    });

    if (exists) {
      throw new UniqueEmailException(createUserDTO.email);
    }

    // Create a new user with the hashed password and save the user to database
    const user = this.userRepository.create({
      ...createUserDTO,
      password: await this.hashPassword(createUserDTO.password),
    });
    return user;
  }

  /**
   * validate user email and password
   * @returns user
   */
  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new IncorrectPasswordException();
    }

    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOne({ _id: id });
      return user;
    } catch (err) {
      this.logger.warn(err);
      throw new UserNotFoundException();
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOne({ email });
      return user;
    } catch (err) {
      this.logger.warn(err);
      throw new UserNotFoundException(email);
    }
  }

  async resetPassword(id: string, password: string): Promise<UserDocument> {
    return this.userRepository.findOneAndUpdate(
      { _id: id },
      { password: this.hashPassword(password) },
    );
  }

  // Generate a salt and hash the user's password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(+this.configService.get('SALT_SECRET'));
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }
}
