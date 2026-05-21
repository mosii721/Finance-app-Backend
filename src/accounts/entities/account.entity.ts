import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

export enum AccountType {
    CHECKING = 'checking',
    SAVINGS = 'savings',
    MOBILE_MONEY = 'mobile_money', // M-Pesa etc.
    CASH = 'cash',
    CREDIT = 'credit',
}

@Entity()
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column()
    userId:string
    
    @Column({type:'enum', enum: AccountType, default:AccountType.SAVINGS})
    type: AccountType;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    balance: number;

    @Column({ default:'KES'})
    currency: string;

    @Column({default: true})
    isActive: boolean;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => User, user => user.account, {onDelete: 'CASCADE'})
    @JoinColumn({name:'userId'})
    user: Relation<User>;

    @OneToMany(() => Transaction, transaction => transaction.account)
    transaction: Transaction[];
}
