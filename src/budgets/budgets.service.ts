import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class BudgetsService {
  constructor(@InjectRepository(Budget) private readonly budgetRepository: Repository<Budget>,
  @InjectRepository(User) private readonly usersRepository: Repository<User>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,) {}

  async create(createBudgetDto: CreateBudgetDto) {
    const existUser = await this.usersRepository.findOne({where:{id: createBudgetDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('The User does not exist')
    }

    const existCategory = await this.categoryRepository.findOne({where:{id:createBudgetDto.categoryId}, select:{id:true}})

    if(!existCategory) {
      throw new Error('That Category does not exist')
    }

    const newBudget = this.budgetRepository.create({
      limitAmount: createBudgetDto.limitAmount,
      spentAmount: createBudgetDto.spentAmount,
      startDate: createBudgetDto.startDate,
      endDate: createBudgetDto.endDate,
      period: createBudgetDto.period,
      user: existUser,
      category: existCategory,
    })

    
    return await this.budgetRepository.save(newBudget);
  }

  async findAll() {
    return await this.budgetRepository.find({relations:{user:true, category:true}});
  }

  async findOne(id: string) {
    return await this.budgetRepository.findOneBy({id});
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    return await this.budgetRepository.update(id,updateBudgetDto);
  }

  async remove(id: string) {
    return await this.budgetRepository.delete(id);
  }
}
