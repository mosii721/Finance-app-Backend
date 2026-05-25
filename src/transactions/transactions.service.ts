import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
  @InjectRepository(Account) private readonly accountsRepository: Repository<Account>,
  @InjectRepository(User) private readonly usersRepository: Repository<User>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const existUser = await this.usersRepository.findOne({where:{id: createTransactionDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('This User does not exist')
    }

    const existAccount = await this.accountsRepository.findOne({where:{id: createTransactionDto.accountId}, select:{id:true}})

    if(!existAccount) {
      throw new Error('The account does not exist')
    }

    let existCategory = null
    if(createTransactionDto.categoryId) {
      const existCategory = await this.categoryRepository.findOne({where:{id: createTransactionDto.categoryId}, select:{id:true}})

      if(!existCategory) {
        throw new Error('This Category does not exist')
      }
    }

    const newTransaction = this.transactionsRepository.create({
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      description: createTransactionDto.description,
      notes: createTransactionDto.notes,
      transactionDate: createTransactionDto.transactionDate,
      user: existUser,
      account: existAccount,
      category: existCategory ?? undefined,
    })
    return await this.transactionsRepository.save(newTransaction);
  }

  async findAll() {
    return await this.transactionsRepository.find({relations:{account:true,category:true,user:true}});
  }

  async findOne(id: string) {
    return await this.transactionsRepository.findOneBy({id});
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return await this.transactionsRepository.update(id,updateTransactionDto);
  }

  async remove(id: string) {
    return await this.transactionsRepository.delete(id);
  }
}
