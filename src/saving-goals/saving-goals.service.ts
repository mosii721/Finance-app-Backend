import { Injectable } from '@nestjs/common';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SavingGoal } from './entities/saving-goal.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account, AccountType } from 'src/accounts/entities/account.entity';

@Injectable()
export class SavingGoalsService {
  constructor(@InjectRepository(SavingGoal) private readonly savingsGoalRepository: Repository<SavingGoal>,
  @InjectRepository(User) private readonly usersRepository: Repository<User>,) {}

  async create(createSavingGoalDto: CreateSavingGoalDto) {
    const existUser = await this.usersRepository.findOne({where:{id: createSavingGoalDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('This User does not exist')
    }

    const newSavingsGoal = this.savingsGoalRepository.create({
      name: createSavingGoalDto.name,
      targetAmount: createSavingGoalDto.targetAmount,
      currentAmount: createSavingGoalDto.currentAmount,
      status: createSavingGoalDto.status,
      targetDate: createSavingGoalDto.targetDate,
      user: existUser
    })

    return await this.savingsGoalRepository.save(newSavingsGoal);
  }

  async findAll(name:string) {
    if(name) {
      return await this.savingsGoalRepository.findOne({where:{name:name},
      select:{id:true, name:true, targetAmount: true, currentAmount:true, status:true, targetDate: true, createdAt:true, UpdatedAt:true},
      relations:{user:true}})
    }
    return await this.savingsGoalRepository.find({relations:{user:true}});
  }

  async findOne(id: string) {
    return await this.savingsGoalRepository.findOneBy({id});
  }

  async update(id: string, updateSavingGoalDto: UpdateSavingGoalDto) {
    return await this.savingsGoalRepository.update(id,updateSavingGoalDto);
  }

  async remove(id: string) {
    return await this.savingsGoalRepository.delete(id);
  }
}
