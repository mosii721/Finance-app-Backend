import { Budget } from "src/budgets/entities/budget.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum CategoryType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column()
    userId: string;
    
    @Column({type:'enum', enum:CategoryType, default:CategoryType.EXPENSE})
    type: CategoryType;

    @Column({nullable:true})
    colour?: string;

    @Column({nullable:true})
    icon?: string;

    @Column({type:'boolean', default:true})
    isDefault: boolean;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt:string

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt:string

    @ManyToOne(() => User, user => user.category, {onDelete:'CASCADE'})
    @JoinColumn({name:'userId'})
    user: Relation<User>;

    @OneToMany(() => Transaction, transaction => transaction.category)
    transaction: Transaction[];

    @OneToMany(() => Budget, budget => budget.category)
    budget: Budget[];

}
