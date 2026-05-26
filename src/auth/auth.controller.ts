import { Controller, Get, Post, Body, Param, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { RtGuard } from './guards/rt.guard';

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

  @Public()
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('logout/:id')
  logout(@Param('id') id:string) {
    return this.authService.logout(id)
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  refreshToken(@Query('id') id:string, @Req() req:RequestWithUser) {
    const user= req.user
    if(user.sub !== id){
      throw new UnauthorizedException('Id Mismatch')
    }
    return this.authService.refreshToken(id, user.refreshToken)
  }

}
