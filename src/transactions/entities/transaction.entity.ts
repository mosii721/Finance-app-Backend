import { Account } from "src/accounts/entities/account.entity";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER = 'transfer',
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    accountId:string;

    @Column()
    userId:string;

    @Column({nullable:true})
    categoryId:string;

    @Column({type:'decimal', precision:15, scale:2})
    Amount: number;
    
    @Column({type:'enum', enum:TransactionType})
    type: TransactionType;

    @Column({nullable:true})
    description?: string;

    @Column({nullable:true})
    notes?: string;

    @Column({type:'date'})
    transactionDate: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt:string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt:string;

    @ManyToOne(() => Account, account => account.transaction, {onDelete:'SET NULL'})
    @JoinColumn({name: 'accountId'})
    account: Relation<Account>;

    @ManyToOne(() => Category, category => category.transaction, {onDelete:'SET NULL', nullable:true})
    @JoinColumn({name:'categoryId'})
    category: Relation<Category>;

    @ManyToOne(() => User, user => user.transaction, {onDelete:'CASCADE'})
    @JoinColumn({name:'userId'})
    user: Relation<User>;
}
