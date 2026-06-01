import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { DataSource, DeepPartial, QueryRunner, Repository } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Budget } from 'src/budgets/entities/budget.entity';

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private readonly transactionsRepository: Repository<Transaction>,
  @InjectRepository(Account) private readonly accountsRepository: Repository<Account>,
  @InjectRepository(User) private readonly usersRepository: Repository<User>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  private readonly dataSource: DataSource) {}

  private async recalculateBudget(queryRunner: QueryRunner, categoryId: string, userId: string) {
      const budget = await queryRunner.manager.findOne(Budget, {where:{category:{id: categoryId}, user:{id: userId}}})

      if(!budget) return

      const {sum} = await queryRunner.manager
        .createQueryBuilder(Transaction, 't')
        .select('SUM(t.amount)', 'sum')
        .where('t.category = :categoryId', {categoryId})
        .andWhere('t.user = :userId', {userId})
        .andWhere('t.type = :type', {type: TransactionType.EXPENSE})
        .andWhere('t.transactionDate >= :start', {start: budget.startDate})
        .andWhere('t.transactionDate <= :end', {end: budget.endDate})
        .getRawOne();

      await queryRunner.manager.update(Budget, budget.id, {
        spentAmount: Number(sum) || 0,
      })
  }

  private async recalculateAccountBalance(queryRunner: QueryRunner, accountId: string) {
    const { incomeSum } = await queryRunner.manager
      .createQueryBuilder(Transaction,'t')
      .select('SUM(t.amount)', 'incomeSum')
      .where('t.accountId =:accountId', {accountId})
      .andWhere('t.type = :type', {type: TransactionType.INCOME})
      .getRawOne();

    const {expenseSum} = await queryRunner.manager // query.manager gives us access to db operations like repository
      .createQueryBuilder(Transaction,'t')
      .select('SUM(t.amount)', 'expenseSum') // instead of selecting all columns only calculate the total of all amount values and give it the name expense sum
      .where('t.accountId =: accountId', {accountId}) // filter for a specific account id
      .andWhere('t.type =:type', {type: TransactionType.EXPENSE})
      .getRawOne(); // execute the query and return one raw result object e.g { expenseSum: 2000} sum always returns a single row

    const balance = (Number(incomeSum) || 0) - (Number(expenseSum)) || 0 // Number converts postgers string to number 

    await queryRunner.manager.update(Account, accountId, {balance} )
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const existUser = await this.usersRepository.findOne({where:{id: createTransactionDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('This User does not exist')
    }

    const existAccount = await this.accountsRepository.findOne({where:{id: createTransactionDto.accountId}, select:{id:true}})

    if(!existAccount) {
      throw new Error('The account does not exist')
    }

    let existCategory: Category | null = null
    if(createTransactionDto.categoryId) {
      existCategory = await this.categoryRepository.findOne({where:{id: createTransactionDto.categoryId}, select:{id:true}})

      if(!existCategory) {
        throw new Error('This Category does not exist')
      }
    }

    const transactionDate = new Date(createTransactionDto.transactionDate);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const transaction = queryRunner.manager.create(Transaction,{
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        description: createTransactionDto.description,
        transactionDate: transactionDate,
        account: {id: existAccount.id},
        category: {id: existCategory?.id ?? undefined},
        user: {id: existUser.id}
      }) as DeepPartial<Transaction>;

      await queryRunner.manager.save(transaction)

      await this.recalculateAccountBalance(queryRunner, existAccount.id)

      if(existCategory) {
        await this.recalculateBudget(queryRunner, existCategory.id, existUser.id);
      }

      await queryRunner.commitTransaction();
      return transaction;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

  }

  async findAll() {
    return await this.transactionsRepository.find({relations:{account:true,category:true,user:true}});
  }

  async findOne(id: string) {
    return await this.transactionsRepository.findOneBy({id});
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto,  userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const oldTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { id },
        select: { id: true, categoryId: true, userId: true , transactionDate: true}
      });
      if (!oldTransaction) throw new NotFoundException('Transaction not found');

      const transaction = await queryRunner.manager.update(Transaction,{id},{
        amount: updateTransactionDto.amount,
        type: updateTransactionDto.type,
        description: updateTransactionDto.description,
        transactionDate: updateTransactionDto.transactionDate
          ? new Date(updateTransactionDto.transactionDate)
          : oldTransaction.transactionDate,
        accountId: updateTransactionDto.accountId,
        categoryId: updateTransactionDto.categoryId,
      }) 

      await this.recalculateAccountBalance(queryRunner, oldTransaction.accountId)

      if (oldTransaction.categoryId) {
      await this.recalculateBudget(queryRunner, oldTransaction.categoryId, userId);
      }

      if (updateTransactionDto.accountId && 
          updateTransactionDto.accountId !== oldTransaction.accountId) {
        await this.recalculateAccountBalance(queryRunner, updateTransactionDto.accountId);
      }

      if (
      updateTransactionDto.categoryId &&
      updateTransactionDto.categoryId !== oldTransaction.categoryId
      ) {
        await this.recalculateBudget(queryRunner, updateTransactionDto.categoryId, userId);
      }

      await queryRunner.commitTransaction()
      return transaction
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async remove(id: string, userId:string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try{
      const oldTransaction = await queryRunner.manager.findOne(Transaction, {
        where: { id },
        select: { id: true, categoryId: true, userId: true , transactionDate: true}
      });
      if (!oldTransaction) throw new NotFoundException('Transaction not found');

      await queryRunner.manager.delete(Transaction,{id})

      await this.recalculateAccountBalance(queryRunner, oldTransaction.accountId)

      if (oldTransaction.categoryId) {
        await this.recalculateBudget(queryRunner, oldTransaction.categoryId, userId)
      }

      await queryRunner.commitTransaction()
      return { message: 'Transaction deleted successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }
}
