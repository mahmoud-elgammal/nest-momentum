import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UsePublicGuard = () => UseGuards(AuthGuard('refresh-token'));