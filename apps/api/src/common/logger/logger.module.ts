import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

@Module({
    imports: [PinoModule.forRoot({
       pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    })],
})
export class LoggerModule {}
