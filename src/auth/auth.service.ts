import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
  private readonly configService: ConfigService,
  private readonly jwtService: JwtService) {}

  private async getTokens(userId:string,email:string,role:string) {
    const [at,rt] = await Promise.all([this.jwtService.signAsync({sub:userId, email:email, role: role},{
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRES_IN')
    }),
    this.jwtService.signAsync({sub:userId, email:email, role:role},{
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<number>('JWT_REFRESH_TOKEN_EXPIRES_IN')
    })])

    return {accessToken: at, refreshToken: rt}
  }

  private async hashRefreshToken(token:string) {
    const salt = Bcrypt.genSalt(10)
    return Bcrypt.hash(token, salt)
  }

  private async saveRefreshToken(userId:string, refreshToken:string) {
    const hashRefreshToken = await this.hashRefreshToken(refreshToken)
    return await this.userRepository.update(userId,{hashedRefreshToken: hashRefreshToken})
  }

  async login(createAuthDto: CreateAuthDto) {
    const findUser = await this.userRepository.findOne({where:{email: createAuthDto.email}, select:{id:true, email:true, role: true, hashedRefreshToken:true}})

    if(!findUser) {
      throw new NotFoundException('The email does not exist')
    }

    const comparePasswords = await Bcrypt.compare(createAuthDto.password, findUser.password)
    if(!comparePasswords) {
      throw new Error('The password is incorrect')
    }

    const {accessToken, refreshToken} = await this.getTokens(findUser.id, findUser.email, findUser.role)

    const hashedRefreshToken = this.saveRefreshToken(findUser.id, refreshToken)

    return { data:{tokens:{accessToken, hashedRefreshToken }, user:{ id: findUser.id, email: findUser.email, role: findUser.role}}}
  }
  
}
