import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(@InjectRepository(Account) private readonly accountRepository: Repository<Account>,
  @InjectRepository(User) private readonly userRepository: Repository<User>){}

  async create(createAccountDto: CreateAccountDto) {
    const existUser = await this.userRepository.findOne({where:{id: createAccountDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('The User does not exist')
    }

    const newAccount = this.accountRepository.create({
      name: createAccountDto.name,
      balance: createAccountDto.balance,
      type: createAccountDto.type,
      currency: createAccountDto.currency,
      isActive: createAccountDto.isActive ?? true,
      user: existUser
    })
    return await this.accountRepository.save(newAccount);
  }

  async findAll(name:string) {
    if(name) {
      return await this.accountRepository.findOne({where:{name:name},
        select:{name:true,balance:true,type:true,currency:true,isActive:true, createdAt:true, updatedAt:true},
        relations:{user:true,transaction:true}})
    }
    return await this.accountRepository.find({relations:{user:true,transaction:true}});
  }

  async findOne(id: string) {
    return await this.accountRepository.findOneBy({id});
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    return await this.accountRepository.update(id,updateAccountDto);
  }

  async remove(id: string) {
    return await this.accountRepository.delete(id);
  }
}
