import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next:NextFunction) {
    const startTime = Date.now()

    console.log(`[\x1b[33m ${new Date().toISOString()}\x1b[0m] \x1b[33m${req.method}\x1b[0m] ${req.path}]]`)

    const originalEnd = res.end.bind(res)

    res.end = function(...args:Parameters<Response['end']>) {
      const duration = Date.now() - startTime

      console.log(`[\x1b[33m ${new Date().toISOString()}\x1b[0m] \x1b[33m${req.method}\x1b[0m] ${req.path } - ${req.statusCode} \x1b[33m${duration}\x1b[0m] ms ]`)

      return originalEnd.apply(res, args) as Response
    } as Response['end']

    next();
  }
}
