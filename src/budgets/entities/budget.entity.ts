import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum BudgetPeriod {
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

@Entity()
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    userId:string

    @Column()
    categoryId:string

    @Column({type:'decimal', precision:15, scale:2})
    limitAmount: number;

    @Column({type:'decimal', precision:15, scale:2, default:0})
    spentAmount: number;

    @Column({type:'enum', enum:BudgetPeriod, default:BudgetPeriod.MONTHLY})
    period: BudgetPeriod;

    @Column({type:'date'})
    startDate: string;

    @Column({type:'date'})
    endDate: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => User, user => user.budget, {onDelete:'CASCADE'})
    @JoinColumn({name:'userId'})
    user: Relation<User>;

    @ManyToOne(() => Category, category => category.budget, {onDelete:'CASCADE'})
    @JoinColumn({name:'categoryId'})
    category: Relation<Category>
}
