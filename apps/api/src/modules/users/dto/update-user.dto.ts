import { OmitType } from "@nestjs/swagger";
import { CreateUserDTO } from "./create-user.dto";

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['email', 'password']) {}