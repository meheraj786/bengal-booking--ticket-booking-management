import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export type AuthUser = {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "SELLER" | "USER";
  isVerified: boolean;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
