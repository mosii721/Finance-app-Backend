import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
    sub:string,
    email: string
}

interface JwtPayloadRt extends JwtPayload {
    refreshToken: string
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,'jwt-rt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
            ignoreExpiration:false
        })
    }

    validate(req: Request, payload: JwtPayloadRt): JwtPayloadRt {
        const authHeader = req.get('Authorization')
        if(!authHeader) {
            throw new UnauthorizedException('No Refresh Token provided')
        }

        const refreshToken = authHeader.replace('Bearer','').trim()
        if(!refreshToken) {
            throw new UnauthorizedException('Invalid refresh Token')
        }

        return{...payload, refreshToken}
        
    }
}