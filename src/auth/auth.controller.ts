import { Controller, Get, Post, Body, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';

interface RequestWithUser extends Request{
  user:{
    sub:string,
    email: string,
    refreshToken:string,
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('logout/:id')
  logout(@Param('id') id:string) {
    return this.authService.logout(id)
  }

  @Get('refreshToken')
  refreshToken(@Query('id') id:string, @Req() req:RequestWithUser) {
    const user= req.user
    if(user.sub !== id){
      throw new UnauthorizedException('Id Mismatch')
    }
    return this.authService.refreshToken(id, user.refreshToken)
  }

}
