import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseLocalAuthGuard = () => UseGuards(AuthGuard('local'));