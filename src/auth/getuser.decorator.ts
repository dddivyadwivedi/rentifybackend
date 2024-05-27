import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/entity/user/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    // console.log(req)
    return req.user;
  },
);
