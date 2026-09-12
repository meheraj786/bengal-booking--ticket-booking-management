import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader("x-request-id", req.header("x-request-id") ?? randomUUID());
    next();
  }
}
