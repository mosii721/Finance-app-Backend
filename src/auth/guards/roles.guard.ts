import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User, UserRole } from "src/users/entities/user.entity";
import { ROLES_KEY } from "../decorators/role.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { JwtPayload } from "../strategies/at.strategy";

interface UserRequest extends Request{
    user?: JwtPayload
}

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly reflector:Reflector) {}

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const rolesRequired = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY,[context.getHandler(),context.getClass()])

        if(!rolesRequired) {
            return true
        }

        const request = context.switchToHttp().getRequest<UserRequest>()
        const user = request.user

        if(!user) {
            return false
        }

        const User = await this.userRepository.findOne({where:{id: user?.sub}, select:{id:true, role:true}})
        if(!User) {
            return false 
        }

        return rolesRequired.some((role) => User.role == role)
    }
}