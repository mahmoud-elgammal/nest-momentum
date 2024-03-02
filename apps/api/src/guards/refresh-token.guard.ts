import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseRefreshTokenGuard = () => UseGuards(AuthGuard('refresh-token'));