import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type JwtPayload = {
    sub:string,
    email:string,
    role:string
}

export class AtStrategy extends PassportStrategy(Strategy,'jwt-at') {
    constructor(private readonly configService:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
            ignoreExpiration: false
        })
    }

    validate(payload: JwtPayload): JwtPayload {
        return payload
    }
}