import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>){}

  private async hashPassword(password:string) {
    const salt = await Bcrypt.genSalt(10)
    return Bcrypt.hash(password,salt)
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersRepository.findOne({where:{email: createUserDto.email},select:{id:true}})

    if(existUser){
      throw new Error('User with existing email already exists')
    }

    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      role: createUserDto.role,
      password: await this.hashPassword(createUserDto.password),
      currency: createUserDto.currency ?? 'KES',
    })

    const savedUser = await this.usersRepository.save(newUser)
    return savedUser;
  }

  async findAll(email:string, name:string) {
    if(name || email) {
      return await this.usersRepository.findOne({where:{name:name, email:email},
        select:{id:true,email:true,name:true,phone:true,currency:true,role:true,createdAt:true,updatedAt:true},
        relations:{account:true, category:true, budget:true, savingsGoal:true, transaction:true}})
    }
    return await this.usersRepository.find({relations:{account:true, category:true, budget:true, savingsGoal:true, transaction:true}});
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneBy({id});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
