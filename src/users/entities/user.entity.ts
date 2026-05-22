import { Account } from "src/accounts/entities/account.entity";
import { Budget } from "src/budgets/entities/budget.entity";
import { Category } from "src/categories/entities/category.entity";
import { SavingGoal } from "src/saving-goals/entities/saving-goal.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    USER ='user',
    Guest = 'guest'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    email: string;
    
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({default:'KES'})
    currency: string;

    @Column()
    password: string;

    @Column({type:'enum', enum:UserRole, default:UserRole.USER})
    role: UserRole;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt:string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt:string;

    @OneToMany(() => Account, account => account.user)
    account: Account[];

    @OneToMany(() => Category, category => category.user)
    category: Category[];

    @OneToMany(() => Budget, budget => budget.user)
    budget: Budget[];

    @OneToMany(() => SavingGoal, savingsGoal => savingsGoal.user)
    savingsGoal: SavingGoal[];

    @OneToMany(() => Transaction, transaction => transaction.user)
    transaction: Transaction[];

}
