import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseAccessTokenGuard = () => UseGuards(AuthGuard('access_token'));