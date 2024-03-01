import { Injectable } from '@nestjs/common';
import { shared } from 'shared';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: shared() };
  }
}
