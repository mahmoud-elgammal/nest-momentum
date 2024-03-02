import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';

export const IpAddress = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    
    // Use the request-ip library to get the IP address
    const ip = requestIp.getClientIp(request);

    return ip;
  },
);
